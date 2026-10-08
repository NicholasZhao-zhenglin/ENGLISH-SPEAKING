# 英语口语训练应用 · English Speaking Trainer

一个面向**真实场景表达**的口语训练应用。不背单词、不刷选择题，而是用「**1 句母句 + 3 个迁移场景**」的方式，逼你把同一个句式在不同场景里说出来 —— 练的是嘴，不是键盘。

**在线使用：** https://nicholaszhao-zhenglin.github.io/ENGLISH-SPEAKING/

---

## 它解决什么问题

传统英语学习卡在「输入强、输出弱」：看得懂、听得懂，但轮到自己开口就卡住。

这个应用的做法是：**每天只学一个句式，但要在 3 个不同场景里把它用出来。**

```
今天学：Could we have some water, please?
          ↓ 举一反三（必须语音作答）
  在酒店想再要一床被子  → Could we have an extra blanket, please?
  在咖啡店想多要几张餐巾纸 → Could we have some more napkins, please?
  在飞机上想向空乘要橙汁  → Could I have a glass of orange juice, please?
```

母句是 1 个 pattern，3 个迁移题强迫你在不同语境里复现它 —— 这才是「学以致用」。

---

## 功能

### 课程结构

```
类目 (生活 / 工作)
  └── 场景 topic（餐厅用餐、面试、会议…）
        └── 单元 unit
              ├── anchor      1 句母句（英/中/用法提示）
              ├── transfers   3 个迁移场景（必须语音作答）
              ├── summary     3–4 条核心知识要点
              └── quiz        4 道选择题
```

**每日解锁机制**：共 18 个单元，开课首日解锁 1 个，之后每自然日 +1，最多 18 —— 强制「一天一小节」的节奏，避免贪多。

### 四种模式

| 模式 | 说明 |
| --- | --- |
| **今日学习** | 母句跟读 → 3 个迁移题语音作答 → 知识要点 → 随堂测验 |
| **自由练习** | 情景模拟 / 真实问答，可回看历史记录 |
| **AI 对话** | 5 个角色（自由对话 / 服务员 / 面试官 / 店员 / 同事），多轮英语对话 |
| **我的记录** | 正确率统计、练习历史、课程重置 |

### 语音能力（两条路径）

- **浏览器实时识别** —— Web Speech API，边说边出字，9 秒无结果自动停止防挂死
- **录音送大模型** —— MediaRecorder 录音 → base64 → Edge Function → 千问音频理解，用于评分与对话

---

## 技术设计

### 架构

```
前端（GitHub Pages，零构建原生 JS）
  │
  ├── 数据层  store.js ──┬── CloudStore → Supabase RPC（同步码）
  │                      └── LocalStore → localStorage（自动降级）
  │
  └── AI 层  supabase/functions/
               ├── audio-eval   → 千问 qwen-omni-turbo（语音 → 文本）
               └── gpt-proxy    → gpt-5.5（文本推理：评分 / 对话）
```

**为什么把语音和文本拆成两个函数？** 让「听懂」和「思考」各用最合适的模型，两者可以独立替换，互不影响。

### 几个值得说的工程决策

**1. 无 SDK 的同步码鉴权**

用 8 位同步码（字符集去掉易混淆的 `I/L/O/0/1` 共 31 个字符，拒绝采样消除模偏差）代替邮箱注册。

问题在于：同步码不是 JWT，`auth.uid()` 恒为空，如果沿用「RLS 策略 + 客户端直接读写表」，等价于**允许匿名 SELECT 全表**。

解法是把所有数据访问收敛到一个唯一入口 —— `SECURITY DEFINER` 的 RPC：

```sql
-- 撤销 anon 对表的直接权限，只暴露两个函数
REVOKE ALL ON attempts FROM anon;
GRANT EXECUTE ON FUNCTION sync_pull(text) TO anon;
GRANT EXECUTE ON FUNCTION sync_push(text, jsonb) TO anon;
```

函数内部按同步码过滤，**拿不到码就查不到数据**。

验证方式（可复现）：用 publishable key 未登录直接 `GET /rest/v1/attempts`，应返回 **401**；返回 200 说明权限没收紧。

**2. 静默降级要留痕**

`config.js` 留空时自动退化为纯本地模式。但降级逻辑有个陷阱：**它会把「配置读取失败」伪装成「正常降级」**。

曾经踩过一次：顶层 `const BACKEND_CONFIG` 不会挂到 `window` 上，而 `store.js` 读的是 `window.BACKEND_CONFIG` —— 结果是配置永远读不到，永远走本机模式，但界面一切正常，很难发现。

现在配置读取失败会在状态栏明确提示，不再静默吞掉。

**3. 并发写入的去重**

`save()` 与后台 `sync()` 并发时会同时读到待推送队列非空，把同一条记录推两次。

解法是加 `syncing` 互斥锁，并把同步流程改成收敛循环：

```
push pending → pull → 按 rowKey 合并 → 若仍有 localOnly 则再推 → 直到收敛
```

验证：全新随机码绑定并练习，云端恰好 1 条记录，无重复。

**4. 零构建的取舍**

原生 HTML/CSS/JS，没有打包工具。代价是没有模块系统和 tree-shaking，收益是：

- 改完直接推到 `gh-pages` 就生效，没有构建步骤
- 依赖极简 —— 连 supabase-js 都去掉了，改用原生 `fetch` 调 RPC（CDN 在国内不稳定，随仓库分发 218KB 的 SDK 也不划算）

---

## 快速开始

### 纯前端模式（零配置）

```bash
git clone https://github.com/NicholasZhao-zhenglin/ENGLISH-SPEAKING.git
cd ENGLISH-SPEAKING
python3 -m http.server 8765
# 打开 http://localhost:8765
```

不填任何配置即可使用 —— 数据存在浏览器 localStorage，语音走 Web Speech API。

### 启用云端同步 + AI 能力

见 **[SETUP.md](./SETUP.md)**，需要：

1. 一个 Supabase 项目
2. 在 SQL Editor 执行 `supabase-sync-schema.sql`
3. 部署两个 Edge Function 并设置 API Key 环境变量

---

## 当前状态

| 能力 | 状态 |
| --- | --- |
| 课程系统（18 单元 / 每日解锁 / 测验） | ✅ 完成 |
| 同步码 + 云端多端同步 | ✅ 完成（含 RPC 权限收紧验证） |
| 浏览器语音识别（Web Speech API） | ✅ 完成 |
| AI 语音评测 + AI 对话 | ⚠️ **代码就绪，Edge Function 待部署** |

> AI 功能的前端、Edge Function 代码、防滥用校验都已完整，但 `audio-eval` / `gpt-proxy` **尚未部署到 Supabase**，因此线上暂不可用。部署步骤见 [SETUP.md](./SETUP.md)。

---

## 测试

四套冒烟测试，用无头 Chrome + playwright-core 驱动真实页面：

| 测试 | 断言数 | 覆盖 |
| --- | --- | --- |
| `esp-ai-test.js` | 20 / 20 | AI 评测与对话流程（含未部署时的错误降级） |
| `esp-sync-test.js` | 33 / 33 | 同步码绑定、推送、拉取、去重 |
| `esp-curriculum-test.js` | 39 / 39 | 课程结构、解锁拦截、测验判分 |
| `esp-daily-unlock-test.js` | 15 / 15 | 每日解锁计数与跨日行为 |

> 测试脚本未随仓库分发（依赖本地 Chrome 路径）。如果你需要，告诉我，我整理成可复现的形式。

---

## 安全说明

- 千问 Key 与中转站 Key **只存在于 Supabase 环境变量**，不进仓库
- Edge Function 强制校验同步码，防止额度被白嫖
- 同步码是唯一凭据，**遗失无法找回**，建议生成后存到手机备忘录
- 仓库内含 `.gitignore` 排除 `.workbuddy/`（工具工作目录）

---

## 技术栈

`JavaScript` · `HTML/CSS` · `Supabase`（Postgres / RLS / Edge Functions）· `Deno` · `Web Speech API` · `MediaRecorder` · `qwen-omni-turbo` · `gpt-5.5`
