// Thin wrapper around the Anthropic SDK. All AI traffic should go through this
// so we have one place for retries, cost accounting, and error normalization.
import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set. Add it to .env.local to use AI features."
      );
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

export interface CallClaudeOptions {
  model: string;
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
}

export interface CallClaudeResult {
  content: string;
  tokensIn: number;
  tokensOut: number;
}

export async function callClaude(opts: CallClaudeOptions): Promise<CallClaudeResult> {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: opts.model,
    max_tokens: opts.maxTokens ?? 4096,
    temperature: opts.temperature ?? 0.2,
    system: opts.system,
    messages: [{ role: "user", content: opts.user }],
  });

  // Extract text blocks
  const textBlocks = response.content.filter(
    (block): block is Anthropic.TextBlock => block.type === "text"
  );
  const content = textBlocks.map((b) => b.text).join("\n");

  return {
    content,
    tokensIn: response.usage?.input_tokens ?? 0,
    tokensOut: response.usage?.output_tokens ?? 0,
  };
}

// Streaming variant — returns an async iterator of text deltas plus final usage.
export async function* streamClaude(
  opts: CallClaudeOptions
): AsyncGenerator<{ delta?: string; usage?: { in: number; out: number } }> {
  const anthropic = getClient();

  const stream = anthropic.messages.stream({
    model: opts.model,
    max_tokens: opts.maxTokens ?? 4096,
    temperature: opts.temperature ?? 0.2,
    system: opts.system,
    messages: [{ role: "user", content: opts.user }],
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      yield { delta: event.delta.text };
    }
  }

  const final = await stream.finalMessage();
  yield {
    usage: {
      in: final.usage?.input_tokens ?? 0,
      out: final.usage?.output_tokens ?? 0,
    },
  };
}
