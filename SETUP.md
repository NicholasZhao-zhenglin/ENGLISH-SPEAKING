# 配置说明

这个项目有两块后端能力，都需要在 Supabase 里各做一次配置：

| 功能 | 依赖 | 状态 |
|---|---|---|
| 多端同步（同步码） | `supabase-sync-schema.sql` 建表 + RPC | ✅ 已完成 |
| AI 语音评测 / 对话 | Edge Function `audio-eval` + 千问 key | **待部署** |

---

## 一、多端同步（已完成）

8 位同步码方案，跨设备合并练习记录。之前已经在 SQL Editor 执行过 `supabase-sync-schema.sql`，无需再操作。

自检：`sync_pull` / `sync_push` 两个函数可调用，匿名直接读表被 401 拒绝。

---

## 二、AI 语音功能（待部署）

现在前端已经接好了「AI 智能评测」和「AI 对话」两个入口，但它们要调一个后端代理函数 `audio-eval`——这个函数负责**藏着你的千问 API key 去调 qwen-omni-turbo**（key 绝不进前端，前端是公开的 GitHub Pages）。

你只需要做两件事：**① 部署函数，② 把千问 key 设成环境变量**。

### 方式 A：Supabase CLI（推荐，一次装好）

在终端里依次执行：

```bash
# 1. 安装 CLI（macOS，二选一）
brew install supabase/tap/supabase
# 或：npm install -g supabase

# 2. 登录（会打开浏览器授权）
supabase login

# 3. 进入项目目录，关联到你的 Supabase 项目
cd /Users/yangqijun/CodexCLI/english-speaking
supabase init          # 若提示已存在则跳过
supabase link --project-ref jumdscnowxsicowfgwnx

# 4. 设置千问 key（把 <你的千问key> 换成 sk- 开头的真实值）
supabase secrets set DASHSCOPE_API_KEY=<你的千问key>

# 5. 部署函数
supabase functions deploy audio-eval
```

部署成功后，函数地址是 `https://jumdscnowxsicowfgwnx.supabase.co/functions/v1/audio-eval`。

### 方式 B：Supabase 控制台手动

1. 打开 <https://supabase.com/dashboard/project/jumdscnowxsicowfgwnx>
2. 左侧 **Edge Functions** → **New function**（或 **Deploy a new function**）
3. 函数名填 `audio-eval`
4. 把本目录 `supabase/functions/audio-eval/index.ts` 的**全部内容**粘贴进去
5. 在函数的 **Secrets / 环境变量** 里添加一条：`DASHSCOPE_API_KEY` = `你的千问 key`
6. 点 **Deploy**

### 部署成功的自检

在终端跑（或浏览器控制台）：

```bash
curl -X POST "https://jumdscnowxsicowfgwnx.supabase.co/functions/v1/audio-eval" \
  -H "Authorization: Bearer <你的 anon key>" \
  -H "Content-Type: application/json" \
  -d '{"sync_code":"TESTSYNC","task":"eval","audio_base64":"AAAA"}'
```

- 返回 `{"error":"需要有效的同步码才能使用 AI 语音功能"}` → ✅ 函数已部署，防滥用校验生效
- 返回 `{"code":"NOT_FOUND",...}` → ❌ 函数还没部署成功

---

## 三、开始使用

1. 线上地址 <https://nicholaszhao-zhenglin.github.io/ENGLISH-SPEAKING/>
2. 右上角 **同步码** → 生成 / 输入同步码（AI 语音功能**要求已绑定同步码**，这是防别人白嫖你千问额度的钥匙）
3. **情景模拟** / **真实问答** 页：点绿色「AI 智能评测」→ 说一句英语 → 再点一次停止 → 大模型直接听懂并给你语法/用词/流利度反馈
4. **AI 对话** 页：选角色（服务员/面试官/店员…）→ 点「开始说话」→ 说完点停止 → AI 用英语回你，多轮对话

## 常见问题

| 现象 | 原因与处理 |
|---|---|
| 点「AI 智能评测」提示"需要有效的同步码" | 还没绑定同步码，先点右上角「同步码」绑定 |
| 提示"服务端未配置 DASHSCOPE_API_KEY" | Edge Function 部署了但没设 key，补设环境变量 |
| 提示"录音失败 / 无法访问麦克风" | 浏览器没授权麦克风；或 Safari 旧版不支持，换 Chrome/Edge |
| 录音后一直转圈 / 超时 | qwen 音频理解要几秒属正常；若长期超时检查网络 |
| AI 对话回复里混着 TRANSCRIPT/REPLY | 偶发的模型格式不稳定，重试一次即可 |

## 安全须知

- **同步码是钥匙**，拿到它的人能看你的练习记录、还能白嫖你的 AI 语音额度，别发到公开场合
- **千问 key 不要写进任何会进 GitHub 仓库的文件**（`config.js`、`SETUP.md` 等）。它只应存在于 Supabase 的环境变量里
- 忘记同步码没有找回机制，建议生成后存进手机备忘录

## 长期注意

1. 免费项目连续 1 周无请求会自动暂停，去控制台 Restore 即可，数据不丢。
2. 免费层没有自动备份，偶尔点「导出」存一份 JSON。
3. 千问 `qwen-omni-turbo` 免费额度 100 万 token、180 天有效，个人练习用不完。
