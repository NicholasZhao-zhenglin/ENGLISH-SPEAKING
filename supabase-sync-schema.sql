-- ============================================================
-- 英语口语练习工具 · 同步码模式数据库结构
--
-- 用法：Supabase 控制台 → SQL Editor → 整段粘贴执行
-- 可重复执行（幂等），已跑过旧版邮箱模式 schema 的也能直接升级
--
-- 与邮箱模式的根本区别：
--   同步码没有 JWT 身份，所以 RLS 的 auth.uid() 恒为空，
--   若沿用「策略 + 直接读写表」，等于允许匿名请求 SELECT 全表，
--   一次就能把所有用户的数据拉走。
--   因此这里撤销 anon 对表的直接访问，只暴露两个 RPC 函数，
--   函数内部强制按 sync_code 过滤 —— 拿不到码就查不到任何东西。
-- ============================================================

-- ------------------------------------------------------------
-- 1. 表结构升级：user_id 改为可选，新增 sync_code
-- ------------------------------------------------------------
alter table public.attempts alter column user_id drop not null;
alter table public.attempts add column if not exists sync_code text;

-- 旧数据没有同步码，兜底一个值，避免设置 not null 时失败
update public.attempts set sync_code = 'LEGACY' where sync_code is null;
alter table public.attempts alter column sync_code set not null;
alter table public.attempts alter column created_at set default now();

-- 旧表的外键指向 auth.users，同步码模式下用不到，去掉以免插入被拦
alter table public.attempts drop constraint if exists attempts_user_id_fkey;

create index if not exists attempts_sync_code_created_idx
  on public.attempts (sync_code, created_at desc);

-- ------------------------------------------------------------
-- 2. 清理邮箱模式遗留的策略与视图
-- ------------------------------------------------------------
do $$
declare r record;
begin
  for r in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'attempts'
  loop
    execute format('drop policy %I on public.attempts', r.policyname);
  end loop;
end $$;

-- 视图按 user_id 分组，同步码模式下不再适用
drop view if exists public.best_scores;

alter table public.attempts enable row level security;

-- 关键：anon 不再能直接读写表，只能通过下面的函数
revoke all on public.attempts from anon;
revoke all on public.attempts from authenticated;

-- ------------------------------------------------------------
-- 3. 同步码规范化：去掉横线和空格，统一大写
--    让「k7m2-9xq4」「K7M2 9XQ4」「k7m29xq4」都指向同一份数据
-- ------------------------------------------------------------
create or replace function public.normalize_code(p text)
returns text
language sql
immutable
as $$
  select upper(regexp_replace(coalesce(p, ''), '[^A-Za-z0-9]', '', 'g'));
$$;

-- ------------------------------------------------------------
-- 4. 拉取：只返回该同步码名下的记录
-- ------------------------------------------------------------
create or replace function public.sync_pull(p_code text)
returns setof public.attempts
language sql
security definer
set search_path = public
as $$
  select *
  from public.attempts
  where sync_code = public.normalize_code(p_code)
  order by created_at desc
  limit 2000;
$$;

-- ------------------------------------------------------------
-- 5. 写入：批量插入，整批绑定到同一个同步码
-- ------------------------------------------------------------
create or replace function public.sync_push(p_code text, p_rows jsonb)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  if p_rows is null or jsonb_typeof(p_rows) <> 'array' then
    return 0;
  end if;
  if jsonb_array_length(p_rows) > 500 then
    raise exception '单次最多写入 500 条，实际 % 条', jsonb_array_length(p_rows);
  end if;
  if jsonb_array_length(p_rows) = 0 then
    return 0;
  end if;

  insert into public.attempts
    (sync_code, category, mode, item_index, item_title, answer, score, detail, created_at)
  select
    public.normalize_code(p_code),
    coalesce(nullif(r->>'category', ''), 'life'),
    coalesce(nullif(r->>'mode', ''), 'scenario'),
    coalesce((r->>'item_index')::int, 0),
    coalesce(r->>'item_title', ''),
    coalesce(r->>'answer', ''),
    coalesce((r->>'score')::int, 0),
    r->'detail',
    coalesce((r->>'created_at')::timestamptz, now())
  from jsonb_array_elements(p_rows) r;

  get diagnostics n = row_count;
  return n;
end;
$$;

-- ------------------------------------------------------------
-- 6. 权限：函数默认对 public 开放，先收回，再只给 anon
-- ------------------------------------------------------------
revoke execute on function public.sync_pull(text) from public;
revoke execute on function public.sync_push(text, jsonb) from public;
revoke execute on function public.normalize_code(text) from public;

grant execute on function public.sync_pull(text) to anon;
grant execute on function public.sync_push(text, jsonb) to anon;

-- ------------------------------------------------------------
-- 7. 自检：确认配置正确
--    三行应依次为  0 / t / 0   （anon 已无权直接读表）
-- ------------------------------------------------------------
-- select
--   (select count(*) from information_schema.role_table_grants
--     where grantee = 'anon' and table_name = 'attempts'
--       and privilege_type = 'SELECT')                      as anon_可读表,
--   (select relrowsecurity from pg_class
--     where relname = 'attempts')                           as rls_已开启,
--   (select count(*) from information_schema.role_routine_grants
--     where grantee = 'anon'
--       and routine_name in ('sync_pull','sync_push'))      as anon_可调函数;
