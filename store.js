/* ==================== 存储适配层 ====================
 *
 * 对外暴露统一接口，内部两种实现：
 *   cloud —— Supabase（配置了 URL + anon key 且 SDK 加载成功）
 *   local —— 浏览器 localStorage（未配置、或云端不可用时自动降级）
 *
 * 上层业务代码只调 Store.xxx()，不关心底下是哪一种。
 * ==================================================== */

const Store = (() => {
  const LS_DATA = "esp_attempts_v1";

  let mode = "local";      // "cloud" | "local"
  let sb = null;           // supabase client
  let user = null;         // { id, email }
  let cache = [];          // 内存中的练习记录，按时间倒序
  let degraded = false;    // 云端初始化成功但后续请求失败 → 降级标记
  const listeners = [];

  /* ---------- 本地读写 ---------- */

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(LS_DATA) || "[]"); }
    catch { return []; }
  }
  function writeLocal(list) {
    try { localStorage.setItem(LS_DATA, JSON.stringify(list)); } catch {}
  }

  /* ---------- 初始化 ---------- */

  function init() {
    const cfg = window.BACKEND_CONFIG || {};
    const ok = cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase;
    if (!ok) { mode = "local"; user = localUser(); cache = readLocal(); return mode; }

    try {
      sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
      });
      mode = "cloud";
      sb.auth.getSession().then(({ data }) => {
        if (data && data.session) {
          user = { id: data.session.user.id, email: data.session.user.email };
          pull();
        }
        emit();
      });
      sb.auth.onAuthStateChange((_e, s) => {
        user = s ? { id: s.user.id, email: s.user.email } : null;
        if (user) pull();
        emit();
      });
    } catch {
      mode = "local";
      user = localUser();
      cache = readLocal();
    }
    return mode;
  }

  function localUser() { return { id: "local", email: "本机" }; }

  function emit() { listeners.forEach(fn => { try { fn(user); } catch {} }); }
  function onAuthChange(fn) { listeners.push(fn); }

  /* ---------- 登录 ---------- */

  async function sendCode(email) {
    if (mode !== "cloud") return { ok: false, error: "未配置后端，当前为本机模式" };
    try {
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    } catch (e) {
      return { ok: false, error: String(e && e.message || e) };
    }
  }

  async function verifyCode(email, code) {
    if (mode !== "cloud") return { ok: false, error: "未配置后端，当前为本机模式" };
    const token = String(code).trim();
    // 不同版本 / 邮件模板下 type 可能是 email 或 magiclink，两种都试
    const types = ["email", "magiclink"];
    let lastErr = "验证码不正确或已过期";
    for (const type of types) {
      const { data, error } = await sb.auth.verifyOtp({ email, token, type });
      if (!error && data && data.user) {
        user = { id: data.user.id, email: data.user.email || email };
        await pull();
        emit();
        return { ok: true };
      }
      if (error) lastErr = error.message;
    }
    return { ok: false, error: lastErr };
  }

  async function signOut() {
    if (mode === "cloud") { try { await sb.auth.signOut(); } catch {} }
    user = mode === "cloud" ? null : localUser();
    cache = mode === "cloud" ? [] : readLocal();
    emit();
  }

  /* ---------- 数据 ---------- */

  async function pull() {
    if (mode !== "cloud" || !user) return;
    const { data, error } = await sb
      .from("attempts")
      .select("id, category, mode, item_index, item_title, answer, score, detail, created_at")
      .order("created_at", { ascending: false })
      .limit(2000);
    if (error) { degraded = true; return; }
    cache = data || [];
  }

  async function save(rec) {
    const row = {
      category: rec.category,
      mode: rec.mode,
      item_index: rec.item_index,
      item_title: rec.item_title,
      answer: rec.answer,
      score: rec.score,
      detail: rec.detail || null,
    };

    if (mode === "cloud" && user) {
      const { data, error } = await sb
        .from("attempts")
        .insert({ ...row, user_id: user.id })
        .select()
        .single();
      if (error) {
        // 写入失败不能让练习中断：落本地，下次可导出
        degraded = true;
        cache.unshift({ ...row, id: "tmp-" + Date.now(), created_at: new Date().toISOString() });
        return { ok: false, error: error.message };
      }
      cache.unshift(data);
      return { ok: true };
    }

    const item = { ...row, id: "local-" + Date.now(), created_at: new Date().toISOString() };
    cache.unshift(item);
    writeLocal(cache);
    return { ok: true };
  }

  function history() { return cache; }

  /* ---------- 统计 ---------- */

  function dayKey(iso) {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function stats() {
    const list = cache;
    const total = list.length;
    const avg = total ? Math.round(list.reduce((s, r) => s + (r.score || 0), 0) / total) : 0;

    // 每题最高分
    const best = new Map();
    for (const r of list) {
      const k = `${r.category}|${r.mode}|${r.item_index}`;
      if (!best.has(k) || r.score > best.get(k)) best.set(k, r.score);
    }
    let mastered = 0, weak = 0;
    for (const v of best.values()) {
      if (v >= 80) mastered++;
      else if (v < 60) weak++;
    }

    // 连续打卡天数
    const days = new Set(list.map(r => dayKey(r.created_at)));
    let streak = 0;
    const cursor = new Date();
    for (let i = 0; i < 400; i++) {
      const k = dayKey(cursor.toISOString());
      if (days.has(k)) { streak++; cursor.setDate(cursor.getDate() - 1); }
      else if (i === 0) { cursor.setDate(cursor.getDate() - 1); } // 今天还没练，从昨天算起
      else break;
    }

    const byCategory = { life: 0, work: 0 };
    for (const r of list) if (r.category in byCategory) byCategory[r.category]++;

    return { total, avg, mastered, weak, streak, byCategory, distinct: best.size };
  }

  /* ---------- 导出 ---------- */

  function exportJSON() {
    const blob = new Blob([JSON.stringify(cache, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `english-practice-${dayKey(new Date().toISOString())}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return {
    init, onAuthChange, sendCode, verifyCode, signOut,
    save, history, stats, exportJSON, pull,
    get mode() { return mode; },
    get user() { return user; },
    get degraded() { return degraded; },
    isCloud: () => mode === "cloud",
    isSignedIn: () => mode === "cloud" && !!user,
  };
})();
