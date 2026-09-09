-- ============================================================
-- 英语口语练习工具 · 数据库表结构
-- 用法：Supabase 控制台 → SQL Editor → 粘贴执行（整段跑完即可）
-- ============================================================

-- 1. 练习记录表
create table if not exists public.attempts (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,

  category    text not null,              -- 'life' | 'work'
  mode        text not null,              -- 'scenario' | 'open'
  item_index  integer not null,           -- 该题在当前分类当前模式下的序号
  item_title  text not null,              -- 题目名，如「食堂点菜」

  answer      text not null,              -- 用户输入的英文
  score       integer not null,           -- 0-100
  detail      jsonb,                      -- 情景模式存逐词 diff，问答模式存反馈条目

  created_at  timestamptz not null default now()
);

-- 常用查询：按时间倒序拉历史；按题目聚合最高分
create index if not exists attempts_user_created_idx
  on public.attempts (user_id, created_at desc);

create index if not exists attempts_user_item_idx
  on public.attempts (user_id, category, mode, item_index);

-- 2. 开启行级安全（RLS）
-- 不开的话，任何人拿到 anon key 都能读全表。必须开。
alter table public.attempts enable row level security;

-- 3. 策略：每个人只能读写自己的记录
-- auth.uid() 是 Supabase 从请求 JWT 里解出的用户 id，前端伪造不了
drop policy if exists "attempts_owner_all" on public.attempts;
create policy "attempts_owner_all"
  on public.attempts
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. 每题最佳成绩视图（历史面板 / 错题本用）
-- security_invoker = on 让视图按调用者身份执行 RLS。
-- 不加的话视图以属主（postgres）权限运行，会绕过 RLS 泄露所有用户的数据。
create or replace view public.best_scores
with (security_invoker = on) as
select
  user_id,
  category,
  mode,
  item_index,
  max(item_title)  as item_title,
  max(score)       as best_score,
  count(*)         as attempts
from public.attempts
group by user_id, category, mode, item_index;

-- ============================================================
-- 可选：验证码邮件发送频率上不去时的处理
-- ------------------------------------------------------------
-- Supabase 默认发信服务限制为 2 封/小时，且只发给项目团队成员邮箱。
-- 解决：Authentication → Emails → SMTP Settings → Enable Custom SMTP
-- 填 QQ 邮箱即可（免费，限额提升到 30 封/小时）：
--   Host:     smtp.qq.com
--   Port:     587
--   Username: 你的QQ邮箱完整地址
--   Password: QQ邮箱「设置 → 账户 → POP3/SMTP服务」生成的授权码（不是QQ密码）
--   Sender:   你的QQ邮箱地址
-- ============================================================
