/* ==================== 存储适配层（同步码模式） ====================
 *
 * 身份方式：8 位同步码（如 K7M2-9XQ4）。换设备输入同一个码，记录就合并。
 * 不需要注册、不需要邮箱、不依赖任何第三方 SDK —— 直接 fetch 后端 RPC。
 *
 * 两种运行模式：
 *   cloud —— 填了 config.js 的 URL + key，数据经后端同步，多端互通
 *   local —— 没填或后端不可达，退化为纯 localStorage，功能不受影响
 *
 * 写策略：本地永远先落盘（保证不丢），再异步推云端；推失败进 pending 队列，
 *         下次操作时自动补推。练习不会因为网络问题中断。
 * ================================================================= */

const Store = (() => {
  const LS_DATA = "esp_attempts_v1";
  const LS_CODE = "esp_sync_code_v1";
  const LS_PENDING = "esp_pending_v1";
  const LS_CURRICULUM = "esp_curriculum_v1";

  // 去掉了容易看错的 I / L / O / 0 / 1
  const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const CODE_LEN = 8;

  let mode = "local";      // "cloud" | "local"
  let base = "";           // 后端 REST 地址
  let key = "";            // anon key
  let code = null;         // 规范化后的同步码，如 K7M29XQ4
  let cache = [];          // 全部练习记录，按时间倒序
  let pending = [];        // 尚未成功推上云端的记录
  let degraded = false;    // 云端请求失败过 → 界面提示
  let syncing = false;     // 同步锁：防止 push 并发导致云端重复
  const listeners = [];

  /* ---------- 本地读写 ---------- */

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(LS_DATA) || "[]"); }
    catch { return []; }
  }
  function writeLocal(list) {
    try { localStorage.setItem(LS_DATA, JSON.stringify(list)); } catch {}
  }
  function savePending() {
    try { localStorage.setItem(LS_PENDING, JSON.stringify(pending)); } catch {}
  }

  /* ---------- 同步码 ---------- */

  function normalize(raw) {
    return String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  }

  // 拒绝采样：248 = 8 * 31，超出就丢弃重抽，避免取模造成概率偏差
  function generateCode() {
    const out = [];
    const buf = new Uint8Array(1);
    while (out.length < CODE_LEN) {
      crypto.getRandomValues(buf);
      if (buf[0] >= 248) continue;
      out.push(ALPHABET[buf[0] % ALPHABET.length]);
    }
    const s = out.join("");
    return s.slice(0, 4) + "-" + s.slice(4);
  }

  function isValidCode(raw) {
    return normalize(raw).length === CODE_LEN;
  }

  /* ---------- 后端请求 ---------- */

  async function rpc(name, body) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 10000);
    try {
      const res = await fetch(`${base}/rest/v1/rpc/${name}`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: "Bearer " + key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: ctl.signal,
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status} ${text.slice(0, 160)}`);
      // sync_push 成功但无内容时返回空串，不能当 JSON 解析
      return text ? JSON.parse(text) : null;
    } finally {
      clearTimeout(timer);
    }
  }

  /* ---------- 初始化 ---------- */

  function init() {
    const cfg = window.BACKEND_CONFIG || {};
    cache = readLocal();
    try { pending = JSON.parse(localStorage.getItem(LS_PENDING) || "[]"); } catch { pending = []; }

    if (cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) {
      mode = "cloud";
      base = String(cfg.SUPABASE_URL).replace(/\/+$/, "");
      key = cfg.SUPABASE_ANON_KEY;
      const saved = normalize(localStorage.getItem(LS_CODE) || "");
      if (saved.length === CODE_LEN) {
        code = saved;
        // 后台静默同步，失败也不打断页面
        sync();
      }
    }
    emit();
    return mode;
  }

  function emit() { listeners.forEach(fn => { try { fn(code); } catch {} }); }
  function onAuthChange(fn) { listeners.push(fn); }

  /* ---------- 绑定 / 解绑 ---------- */

  async function bindCode(raw) {
    const c = normalize(raw);
    if (c.length !== CODE_LEN) return { ok: false, error: `同步码应为 8 位字母或数字，当前是 ${c.length} 位` };
    if (mode !== "cloud") return { ok: false, error: "未配置后端，当前为本机模式" };

    code = c;
    localStorage.setItem(LS_CODE, c);
    emit(); // 界面立刻变成已绑定；同步在后台跑，结果通过 emit 反映到同步状态徽章

    sync(); // 后台串行同步，结果通过 emit 反映到同步状态徽章

    return { ok: true, error: "" };
  }

  // 生成本机专属的码并立即绑定（首次使用走这条）
  async function createAndBind() {
    if (mode !== "cloud") return { ok: false, code: "", error: "未配置后端，当前为本机模式" };
    const c = generateCode();
    const r = await bindCode(c);
    return { ...r, code: c };
  }

  function unbind() {
    code = null;
    pending = [];
    localStorage.removeItem(LS_CODE);
    localStorage.removeItem(LS_PENDING);
    degraded = false;
    emit();
  }

  /* ---------- 同步 ---------- */

  function toRow(r) {
    return {
      category: r.category,
      mode: r.mode,
      item_index: r.item_index,
      item_title: r.item_title,
      answer: r.answer,
      score: r.score,
      detail: r.detail || null,
      created_at: r.created_at,
    };
  }

  // 去重键：同题目、同答案、同分数、同一秒内 → 视为同一条
  function rowKey(r) {
    const t = Math.floor(new Date(r.created_at).getTime() / 1000);
    return [r.category, r.mode, r.item_index, r.answer, r.score, t].join("|");
  }

  // 只被 sync() 调用，串行执行，不会并发
  async function flush() {
    if (!pending.length) return;
    const batch = pending.slice(0, 500);
    await rpc("sync_push", { p_code: code, p_rows: batch.map(toRow) });
    pending = pending.slice(batch.length);
    savePending();
  }

  // 串行化：推 pending → 拉全量 → 按去重键合并 → 落本地。
  // 循环直到两端一致；syncing 锁保证任何时刻只有一次同步在跑，
  // 杜绝 save() 与后台 sync() 并发 push 同一条记录造成的重复。
  async function sync() {
    if (mode !== "cloud" || !code || syncing) return;
    syncing = true;
    try {
      let guard = 0;
      while (guard++ < 10) {
        await flush();

        const rows = (await rpc("sync_pull", { p_code: code })) || [];
        degraded = false;

        const cloudKeys = new Set(rows.map(rowKey));
        const localOnly = cache.filter(r => !cloudKeys.has(rowKey(r)));
        const merged = [...rows, ...localOnly].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        cache = merged;
        writeLocal(cache);

        if (!localOnly.length) break;
        // 还有本地独有记录没上云，放进队列再推一轮
        pending = localOnly.slice();
        savePending();
      }
    } catch {
      degraded = true;
    } finally {
      syncing = false;
      emit();
    }
  }

  /* ---------- 数据 ---------- */

  async function save(rec) {
    const item = {
      category: rec.category,
      mode: rec.mode,
      item_index: rec.item_index,
      item_title: rec.item_title,
      answer: rec.answer,
      score: rec.score,
      detail: rec.detail || null,
      id: "local-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      created_at: new Date().toISOString(),
    };

    cache.unshift(item);
    writeLocal(cache);

    if (mode !== "cloud" || !code) return { ok: true, cloud: false };

    pending.push(item);
    savePending();
    sync(); // 后台串行同步，不阻塞练习
    return { ok: true, cloud: !degraded };
  }

  function history() { return cache; }

  function historyFor(category) {
    return cache.filter(r => r.category === category);
  }

  /* ---------- 统计 ---------- */

  function dayKey(iso) {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function stats() {
    const list = cache;
    const total = list.length;
    const avg = total ? Math.round(list.reduce((s, r) => s + (r.score || 0), 0) / total) : 0;

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

  /* ---------- 课程（curriculum）进度 ---------- */
  // 仅本地，不上云：跨设备同步意义不大（手机/电脑通常独立学），且 Supabase attempts 表
  // 不适合存课程进度（结构不同）。如果以后真要同步，再单独建一张 curriculum_progress 表。

  let curriculumDone = {};
  try { curriculumDone = JSON.parse(localStorage.getItem(LS_CURRICULUM) || "{}"); } catch { curriculumDone = {}; }

  function saveCurriculum() {
    try { localStorage.setItem(LS_CURRICULUM, JSON.stringify(curriculumDone)); } catch {}
  }

  function markCurriculumDone(key, quizScore) {
    curriculumDone[key] = {
      completedAt: new Date().toISOString(),
      quizScore: typeof quizScore === "number" ? Math.max(0, Math.min(100, quizScore)) : null,
    };
    saveCurriculum();
    emit();
  }

  function isCurriculumDone(key) { return !!curriculumDone[key]; }

  function resetCurriculum() {
    curriculumDone = {};
    saveCurriculum();
    emit();
  }

  /* ---------- 错误提示 ---------- */

  function friendlyError(e) {
    const m = String((e && e.message) || e || "");
    if (/abort|timeout/i.test(m)) return "请求超时，检查网络后重试";
    if (/Failed to fetch|NetworkError/i.test(m)) return "连不上后端，检查网络或后端地址是否填对";
    if (/HTTP 401|HTTP 403/i.test(m)) return "密钥无效或没有权限，检查 config.js 里的 anon key";
    if (/HTTP 404/i.test(m)) return "后端函数不存在，同步用的 SQL 还没执行（见 SETUP.md）";
    if (/HTTP 429/i.test(m)) return "请求太频繁，稍后再试";
    if (/HTTP 5\d\d/i.test(m)) return "后端暂时不可用，稍后再试";
    return m.slice(0, 120) || "同步失败";
  }

  /* ---------- 对外 ---------- */

  function displayCode() {
    if (!code) return "";
    return code.length === CODE_LEN ? code.slice(0, 4) + "-" + code.slice(4) : code;
  }

  return {
    init, onAuthChange, bindCode, createAndBind, unbind, sync,
    save, history, historyFor, stats, exportJSON, generateCode, normalize, isValidCode,
    markCurriculumDone, isCurriculumDone, resetCurriculum,
    get mode() { return mode; },
    get code() { return code; },
    get degraded() { return degraded; },
    get pendingCount() { return pending.length; },
    get curriculumDone() { return curriculumDone; },
    displayCode, friendlyError,
    isCloud: () => mode === "cloud",
    isSignedIn: () => mode === "cloud" && !!code,
  };
})();
