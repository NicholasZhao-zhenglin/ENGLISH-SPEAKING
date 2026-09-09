// Supabase Edge Function：语音 AI 代理
//
// 职责：接收前端录好的音频 + 任务指令，转发给阿里云百炼的 qwen-omni-turbo
//       （多模态模型，直接“听”音频），把评测/对话文本返回给前端。
//
// 为什么要有这一层：DashScope 的 API key 绝不能写进前端（前端在 GitHub Pages
// 上是公开的），所以用 Edge Function 藏 key、做转发。key 存在环境变量
// DASHSCOPE_API_KEY 里，前端永远拿不到。
//
// 防滥用：要求请求带上有效的同步码（8 位），否则拒绝。同步码是用户自己生成的
// 秘密，没有它就不能白嫖这里的语音额度。

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const QWEN_ENDPOINT =
  "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

// 从 qwen-omni 原生响应里抽取文本
function extractText(data: any): string {
  const choices = data?.output?.choices;
  if (Array.isArray(choices) && choices.length) {
    const content = choices[0]?.message?.content;
    if (Array.isArray(content)) {
      return content.map((x: any) => x?.text || "").join("").trim();
    }
    if (typeof content === "string") return content.trim();
  }
  return "";
}

function normalizeCode(raw: unknown): string {
  return String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return json({ error: "仅支持 POST" }, 405);
  }

  try {
    const body = await req.json();

    // 1. 防滥用：同步码必须是 8 位
    const syncCode = normalizeCode(body.sync_code);
    if (syncCode.length !== 8) {
      return json({ error: "需要有效的同步码才能使用 AI 语音功能" }, 403);
    }

    // 2. 音频必须存在
    const audioBase64 = String(body.audio_base64 || "");
    if (audioBase64.length < 100) {
      return json({ error: "缺少音频数据" }, 400);
    }

    // 3. 服务端 key
    const apiKey = Deno.env.get("DASHSCOPE_API_KEY");
    if (!apiKey) {
      return json({ error: "服务端未配置 DASHSCOPE_API_KEY，见 SETUP.md" }, 500);
    }

    const task = body.task === "chat" ? "chat" : "eval";
    const systemPrompt = String(body.system_prompt || "").trim();
    const userText = String(body.user_text || "").trim();

    // 4. 组装 messages
    const messages: any[] = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: [{ text: systemPrompt }] });
    }
    // 对话历史（文本），本轮之前的轮次
    if (task === "chat" && Array.isArray(body.history)) {
      for (const h of body.history) {
        if (!h || !h.role || !h.text) continue;
        const role = h.role === "assistant" ? "assistant" : "user";
        messages.push({ role, content: [{ text: String(h.text).slice(0, 4000) }] });
      }
    }
    // 本轮：音频 + 可选文本
    const content: any[] = [{ audio: "data:;base64," + audioBase64 }];
    if (userText) content.push({ text: userText });
    messages.push({ role: "user", content });

    // 5. 调 qwen-omni-turbo
    const upstream = await fetch(QWEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen-omni-turbo",
        input: { messages },
      }),
    });

    const upstreamData = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      const msg =
        upstreamData?.message || upstreamData?.error?.message ||
        `上游返回 HTTP ${upstream.status}`;
      return json({ error: String(msg) }, 502);
    }

    const text = extractText(upstreamData);
    if (!text) {
      return json({ error: "模型未返回有效文本", raw: JSON.stringify(upstreamData).slice(0, 300) }, 502);
    }

    return json({ text }, 200);
  } catch (e: any) {
    return json({ error: String(e?.message || e) }, 500);
  }
});
