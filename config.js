/* ==================== 后端配置 ====================
 *
 * 把 SUPABASE_URL 和 SUPABASE_ANON_KEY 换成你自己的值即可启用云同步。
 * 两个值都留空时，应用自动降级为「仅本机 localStorage」，功能完全正常，
 * 只是数据不跨设备、清缓存会丢。
 *
 * 取值位置：Supabase 控制台 → Project Settings → API
 *   - Project URL        → SUPABASE_URL
 *   - anon public key    → SUPABASE_ANON_KEY
 *
 * 注意：只填 anon key，不要填 service_role key。
 * service_role key 会绕过行级安全策略，写进前端等于数据库裸奔。
 * ================================================== */

const BACKEND_CONFIG = {
  SUPABASE_URL: "https://supabase.com/dashboard/project/jumdscnowxsicowfgwnx",      // 例：https://abcdefgh.supabase.co
  SUPABASE_ANON_KEY: "sb_publishable_0xBuAfOmBSUgKrB0QtFEYA_mlxzMT4z", // 例：eyJhbGciOi...
};

/* 单个邮箱每小时最多请求几次验证码（前端防抖，避免撞上服务端限流） */
const OTP_COOLDOWN_SEC = 60;
