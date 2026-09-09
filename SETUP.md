# 多端同步配置说明

同步方式：**同步码**。每台设备生成或输入同一个 8 位码，练习记录就自动合并、跨设备互通。不需要注册、不需要邮箱、不依赖任何第三方 SDK。

| 步骤 | 内容 | 状态 |
|---|---|---|
| 1 | 注册 Supabase，建项目 | 已完成 |
| 2 | 填 `config.js`（URL + anon key） | 已完成 |
| 3 | SQL Editor 执行 `supabase-sync-schema.sql` | **待做** |
| 4 | 浏览器里生成 / 输入同步码，开始用 | 待做 |

---

## 你现在要做的事：执行第 3 步（建表 + 开权限）

之前的邮箱模式用了另一个 SQL 文件（`supabase-schema.sql`），那份已经作废删除。**新的同步码模式需要重新执行这份** `supabase-sync-schema.sql`。

1. 打开 <https://supabase.com/dashboard/project/jumdscnowxsicowfgwnx>
2. 左侧 **SQL Editor** → **New query**
3. 把 `supabase-sync-schema.sql` 整段粘贴进去 → **Run**

这份 SQL 可重复执行（幂等），即使之前跑过旧的也不会冲突。

### 这份 SQL 做了什么（为什么必须执行）

同步码没有登录身份，如果还像邮箱模式那样开放表读写，任何人都能用公开密钥拉走**所有用户**的数据。所以它做了三件事：

1. 给 `attempts` 表加 `sync_code` 列
2. **撤销匿名用户直接读写表**的权限
3. 只暴露两个函数作为唯一入口：`sync_pull`（按码拉取）、`sync_push`（按码写入）——函数内部强制按同步码过滤，**拿不到码就查不到任何东西**

### 执行成功的自检

在 SQL Editor 里跑文件末尾这段（把 `--` 注释去掉即可）：

```sql
select
  (select count(*) from information_schema.role_table_grants
    where grantee = 'anon' and table_name = 'attempts'
      and privilege_type = 'SELECT') as anon_可读表,
  (select relrowsecurity from pg_class
    where relname = 'attempts') as rls_已开启,
  (select count(*) from information_schema.role_routine_grants
    where grantee = 'anon'
      and routine_name in ('sync_pull','sync_push')) as anon_可调函数;
```

三列应分别是 **0 / t / 2**。`anon_可读表` 为 0 是关键——说明匿名请求已经不能直接扫全表了。

---

## 第 4 步：开始使用

执行完 SQL，打开线上地址 <https://nicholaszhao-zhenglin.github.io/ENGLISH-SPEAKING/>：

1. 点右上角 **同步码**
2. 第一台设备：点 **生成我的同步码**，会显示一串如 `K7M2-9XQ4` 的码，**复制并记下来**
3. 第二台设备：打开同页 → **同步码** → 切到「输入已有的码」→ 填那串码 → **绑定并同步**

两边记录自动合并。之后任何一台练的题都会同步到云端，换设备继续。

---

## 常见问题

| 现象 | 原因与处理 |
|---|---|
| 点「生成」或「绑定」后，记录面板显示"连不上后端 / 有 N 条待同步" | 正常，SQL 还没执行或网络抖动。数据已存在本机，联网后自动补传 |
| 页面提示"后端函数不存在（HTTP 404）" | 第 3 步的 SQL 没执行，回去执行 |
| 状态条显示"未配置后端" | `config.js` 里的 URL 或 key 没填对，或没推上 gh-pages |
| 换了设备输入码，两边记录没合并 | 确认两边填的是同一个码（不区分大小写，中间的 `-` 可省略） |

## 安全须知

- **同步码就是钥匙**，拿到它的人能看你的练习记录，别发到公开场合
- 忘记码怎么办：因为码只存在你本机，没有找回机制。建议生成后随手存进手机备忘录或密码管理器
- 「换一个」会作废旧码，已绑定旧码的设备需要重新绑定；本机数据不丢，会归到新码下

## 两个长期注意

1. **免费项目连续 1 周无请求会自动暂停。** 去控制台点 Restore 恢复即可，数据不丢。
2. **免费层没有自动备份。** 练习记录只有一份，偶尔点「导出」存一份 JSON 到本地。
