// DeepSeek API client — OpenAI-compatible API.
// Used as alternative to Claude when Anthropic org is disabled.
// DeepSeek models: deepseek-chat (general), deepseek-reasoner (reasoning)

export interface CallDeepSeekOptions {
  model?: string;
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
}

export interface CallDeepSeekResult {
  content: string;
  tokensIn: number;
  tokensOut: number;
}

export async function callDeepSeek(opts: CallDeepSeekOptions): Promise<CallDeepSeekResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not set. Add it to .env or Vercel env vars.");
  }

  const model = opts.model || "deepseek-chat";
  const baseUrl = "https://api.deepseek.com/v1/chat/completions";

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.user },
      ],
      max_tokens: opts.maxTokens ?? 4096,
      temperature: opts.temperature ?? 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("DeepSeek API error " + response.status + ": " + errorText);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  const tokensIn = data.usage?.prompt_tokens || 0;
  const tokensOut = data.usage?.completion_tokens || 0;

  return { content, tokensIn, tokensOut };
}

// Unified LLM call — tries Claude first, falls back to DeepSeek
export async function callLLM(opts: {
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<{ content: string; tokensIn: number; tokensOut: number; model: string }> {
  // Try Claude first
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    try {
      const { callClaude } = await import("@/lib/ai/client");
      const { MODELS } = await import("@/lib/ai/models");
      const result = await callClaude({
        model: MODELS.strong,
        system: opts.system,
        user: opts.user,
        maxTokens: opts.maxTokens,
        temperature: opts.temperature,
      });
      return { ...result, model: MODELS.strong };
    } catch (err: any) {
      console.warn("[LLM] Claude failed, falling back to DeepSeek:", err?.message);
    }
  }

  // Fallback to DeepSeek
  const result = await callDeepSeek({
    model: "deepseek-chat",
    system: opts.system,
    user: opts.user,
    maxTokens: opts.maxTokens,
    temperature: opts.temperature,
  });
  return { ...result, model: "deepseek-chat" };
}
