// Supabase Edge Function：GPT-5.5 文本代理（中转站）
//
// 职责：接收前端发来的「文本 + 评测/对话指令」，转给中转站
//       https://api.codeyizhan.com/v1/chat/completions 的 gpt-5.5，
//       把回复文本原样返回给前端。
//
// 用法：前端先调 audio-eval 拿到语音转写文本，再调本函数做评测 / 对话。
//       这样音频理解交给千问，文本推理交给 gpt-5.5。
//
// 为什么要有这一层：中转站的 API key 绝不能写进前端（前端在 GitHub Pages
// 上是公开的），所以用 Edge Function 藏 key、做转发。key 存在环境变量
// GPT5_API_KEY 里，前端永远拿不到。
//
// 防滥用：要求请求带上有效的同步码（8 位），否则拒绝。

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// 中转站走 OpenAI 兼容 chat completions 格式
const GPT_BASE_URL = Deno.env.get("GPT5_BASE_URL") || "https://api.codeyizhan.com";
const GPT_MODEL = Deno.env.get("GPT5_MODEL") || "gpt-5.5";

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
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
      return json({ error: "需要有效的同步码才能使用 AI 文本功能" }, 403);
    }

    // 2. 文本必须有
    const userText = String(body.text || "").trim();
    if (!userText) {
      return json({ error: "缺少用户输入文本" }, 400);
    }

    // 3. 服务端 key
    const apiKey = Deno.env.get("GPT5_API_KEY");
    if (!apiKey) {
      return json({ error: "服务端未配置 GPT5_API_KEY，见 SETUP.md" }, 500);
    }

    // 4. 组装 messages
    const messages: any[] = [];
    const systemPrompt = String(body.system_prompt || "").trim();
    if (systemPrompt) messages.push({ role: "system", content: systemPrompt });

    // 对话历史（chat 模式）：[{role:"user"|"assistant", text:"..."}]
    if (Array.isArray(body.history)) {
      for (const h of body.history) {
        if (!h || !h.role || !h.text) continue;
        const role = h.role === "assistant" ? "assistant" : "user";
        messages.push({ role, content: String(h.text).slice(0, 4000) });
      }
    }

    // 本轮：context（场景描述等附加信息）+ 用户文本（来自 STT 转写）
    const context = String(body.context || "").trim();
    const userParts: string[] = [];
    if (context) userParts.push(context);
    if (userText) userParts.push(userText);
    messages.push({ role: "user", content: userParts.join("\n\n") });

    // 5. 调中转站 gpt-5.5
    const endpoint = `${GPT_BASE_URL.replace(/\/+$/, "")}/v1/chat/completions`;
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GPT_MODEL,
        messages,
        temperature: 0.7,
      }),
    });

    const upstreamData = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      const msg =
        upstreamData?.error?.message || upstreamData?.message ||
        `上游返回 HTTP ${upstream.status}`;
      return json({ error: String(msg) }, 502);
    }

    // OpenAI 兼容格式：choices[0].message.content
    const text = String(upstreamData?.choices?.[0]?.message?.content || "").trim();
    if (!text) {
      return json({ error: "模型未返回有效文本", raw: JSON.stringify(upstreamData).slice(0, 300) }, 502);
    }

    return json({ text }, 200);
  } catch (e: any) {
    return json({ error: String(e?.message || e) }, 500);
  }
});