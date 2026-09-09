# 配置说明

这个项目有两块后端能力，都需要在 Supabase 里做配置：

| 功能 | 依赖 | 状态 |
|---|---|---|
| 多端同步（同步码） | `supabase-sync-schema.sql` 建表 + RPC | ✅ 已完成 |
| AI 语音 → 文本（千问 STT） | Edge Function `audio-eval` + `DASHSCOPE_API_KEY` | **待部署** |
| AI 文本推理（gpt-5.5） | Edge Function `gpt-proxy` + `GPT5_API_KEY` | **待部署** |

---

## 一、多端同步（已完成）

8 位同步码方案，跨设备合并练习记录。之前已经在 SQL Editor 执行过 `supabase-sync-schema.sql`，无需再操作。

自检：`sync_pull` / `sync_push` 两个函数可调用，匿名直接读表被 401 拒绝。

---

## 二、AI 语音 + AI 文本（待部署）

### 架构说明

```
前端 ──录音──> audio-eval (千问 STT) ──返回 transcript──> 前端
前端 ──transcript──> gpt-proxy (gpt-5.5) ──返回 text──> 前端
```

两步拆分的好处：
- **千问**专门做"听懂"音频（多模态模型，原生支持音频直连）
- **gpt-5.5（中转站）**专门做文本推理（评测 / 对话回复）
- 两个模型可以独立替换，互不影响

防滥用：两个函数都校验 8 位同步码，没有码的人用不了。

---

### 部署步骤

你只需要做三件事：**① 部署函数，② 设两个环境变量**。

#### 方式 A：Supabase CLI（推荐）

```bash
# 1. 装 CLI（二选一）
brew install supabase/tap/supabase
# 或：npm install -g supabase

# 2. 登录（会打开浏览器授权）
supabase login

# 3. 进入项目目录，关联到你的 Supabase 项目
cd /Users/yangqijun/CodexCLI/english-speaking
supabase init          # 若提示已存在则跳过
supabase link --project-ref jumdscnowxsicowfgwnx

# 4. 设置两个 key
supabase secrets set DASHSCOPE_API_KEY=<你的千问key>
supabase secrets set GPT5_API_KEY=<你的中转站gpt-5.5 key>

# 5. 部署两个函数
supabase functions deploy audio-eval
supabase functions deploy gpt-proxy
```

部署成功后两个函数地址：
- `https://jumdscnowxsicowfgwnx.supabase.co/functions/v1/audio-eval`
- `https://jumdscnowxsicowfgwnx.supabase.co/functions/v1/gpt-proxy`

#### 方式 B：Supabase 控制台手动

1. 打开 <https://supabase.com/dashboard/project/jumdscnowxsicowfgwnx>
2. 左侧 **Edge Functions** → **New function**
3. 函数名填 `audio-eval`，把 `supabase/functions/audio-eval/index.ts` 全部内容粘贴进去 → Deploy
4. 再 **New function**，函数名填 `gpt-proxy`，把 `supabase/functions/gpt-proxy/index.ts` 全部内容粘贴进去 → Deploy
5. 在项目的 **Settings → Edge Functions → Secrets** 里添加两条：
   - `DASHSCOPE_API_KEY` = `你的千问 key`
   - `GPT5_API_KEY` = `你的中转站 key`

### 部署成功的自检

终端跑：

```bash
# audio-eval 没带同步码 → 应该 403
curl -X POST "https://jumdscnowxsicowfgwnx.supabase.co/functions/v1/audio-eval" \
  -H "Authorization: Bearer <你的 anon key>" \
  -H "Content-Type: application/json" \
  -d '{"sync_code":"BADCODE","audio_base64":"AAAA"}'
# 期望: {"error":"需要有效的同步码才能使用语音转文字功能"}

# gpt-proxy 没带同步码 → 应该 403
curl -X POST "https://jumdscnowxsicowfgwnx.supabase.co/functions/v1/gpt-proxy" \
  -H "Authorization: Bearer <你的 anon key>" \
  -H "Content-Type: application/json" \
  -d '{"sync_code":"BADCODE","text":"hi"}'
# 期望: {"error":"需要有效的同步码才能使用 AI 文本功能"}
```

返回 `{"code":"NOT_FOUND",...}` → 函数还没部署成功。

---

## 三、开始使用

1. 线上地址 <https://nicholaszhao-zhenglin.github.io/ENGLISH-SPEAKING/>
2. 右上角 **同步码** → 生成 / 输入同步码（AI 功能**要求已绑定同步码**，这是防别人白嫖你额度的钥匙）
3. **情景模拟** / **真实问答** 页：点绿色「AI 智能评测」→ 说一句英语 → 再点一次停止 → 千问听懂你的英文 → gpt-5.5 给出语法/用词/流利度反馈
4. **AI 对话** 页：选角色（服务员/面试官/店员…）→ 点「开始说话」→ 说完点停止 → 千问转写 → gpt-5.5 用英语回你，多轮对话

## 常见问题

| 现象 | 原因与处理 |
|---|---|
| 点「AI 智能评测」提示"需要有效的同步码" | 还没绑定同步码，先点右上角「同步码」绑定 |
| 提示"服务端未配置 DASHSCOPE_API_KEY" | audio-eval 部署了但没设 key |
| 提示"服务端未配置 GPT5_API_KEY" | gpt-proxy 部署了但没设 key |
| 提示"录音失败 / 无法访问麦克风" | 浏览器没授权麦克风；或 Safari 旧版不支持，换 Chrome/Edge |
| 录音后一直转圈 / 超时 | 千问音频理解要几秒属正常；若长期超时检查网络 |
| 转写成功但 gpt-5.5 报错 | 检查 GPT5_API_KEY 是否有效，可单独 curl 测试 |

## 安全须知

- **同步码是钥匙**，拿到它的人能看你的练习记录、还能白嫖你的 AI 额度，别发到公开场合
- **千问 key 和中转站 key 不要写进任何会进 GitHub 仓库的文件**（`config.js`、`SETUP.md` 等）。它们只应存在于 Supabase 的环境变量里
- 忘记同步码没有找回机制，建议生成后存进手机备忘录

## 长期注意

1. 免费项目连续 1 周无请求会自动暂停，去控制台 Restore 即可，数据不丢。
2. 免费层没有自动备份，偶尔点「导出」存一份 JSON。
3. 千问 `qwen-omni-turbo` 免费额度 100 万 token、180 天有效，个人练习用不完。
4. 中转站 `gpt-5.5` 的计费以中转站账单为准，注意用量。