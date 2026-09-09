/* ==================== 后端配置 ====================
 *
 * 把 SUPABASE_URL 和 SUPABASE_ANON_KEY 换成你自己的值即可启用云同步。
 * 两个值都留空时，应用自动降级为「仅本机 localStorage」，功能完全正常，
 * 只是数据不跨设备、清缓存会丢。
 *
 * 取值位置：Supabase 控制台 → Project Settings → API
 *   - Project URL      → SUPABASE_URL     （形如 https://xxxx.supabase.co，
 *                                          不是 supabase.com/dashboard/... 那个网页地址）
 *   - Publishable key  → SUPABASE_ANON_KEY （新的 sb_publishable_ 开头，或旧的 anon key，
 *                                          两者都是设计上可公开的，前端用没问题）
 *
 * 注意：不要填 service_role / secret key。
 * 那种 key 会绕过行级安全策略，写进前端等于数据库裸奔。
 * ================================================== */

/* 用 window.xxx 显式挂载：顶层 const 不会成为 window 的属性，
 * 而 store.js 是通过 window.BACKEND_CONFIG 读取的 */
window.BACKEND_CONFIG = {
  // 注意：不是控制台网页地址（supabase.com/dashboard/...），而是 API 地址
  SUPABASE_URL: "https://jumdscnowxsicowfgwnx.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_0xBuAfOmBSUgKrB0QtFEYA_mlxzMT4z",
};

/* 单个邮箱每小时最多请求几次验证码（前端防抖，避免撞上服务端限流） */
window.OTP_COOLDOWN_SEC = 60;
