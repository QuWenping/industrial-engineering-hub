// Keyword Agent — analyzes an SEO keyword phrase and produces a content brief.
// Model: Haiku (cheap, fast, structured JSON output).
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { MODELS } from "../models";

export const KeywordBriefSchema = z.object({
  intent: z.enum(["informational", "transactional", "navigational", "commercial"]),
  priority: z.enum(["P0", "P1", "P2"]),
  volume_estimate: z.number().int().min(0).max(10_000_000),
  difficulty_estimate: z.number().int().min(1).max(100),
  brief: z.object({
    headline: z.string().min(5).max(120),
    targetAudience: z.string().min(5).max(300),
    painPoints: z.array(z.string()).min(1).max(10),
    suggestedFormulas: z.array(z.string()).max(10),
    outline: z
      .array(z.object({ h2: z.string(), points: z.array(z.string()) }))
      .min(2)
      .max(12),
  }),
});

export type KeywordBrief = z.infer<typeof KeywordBriefSchema>;

const SYSTEM_PROMPT = `You are a senior industrial-engineering SEO strategist.
Analyze the target keyword and return a STRICT JSON object matching the schema below.
No markdown, no commentary, no surrounding code fences. Output must be valid JSON.

Schema:
{
  "intent": "informational|transactional|navigational|commercial",
  "priority": "P0|P1|P2",
  "volume_estimate": integer 0-10000000,
  "difficulty_estimate": integer 1-100,
  "brief": {
    "headline": string (<=120 chars, optimized H1),
    "targetAudience": string,
    "painPoints": string[],
    "suggestedFormulas": string[],
    "outline": [ { "h2": string, "points": string[] } ]
  }
}

Domain: industrial/mechanical/chemical/civil engineering. Prefer ASME/API/ASTM terminology.
Be conservative on volume — engineering keywords are typically 50-5000/month.`;

export interface KeywordAgentResult {
  brief: KeywordBrief;
  tokensIn: number;
  tokensOut: number;
  model: string;
}

export async function analyzeKeyword(phrase: string): Promise<KeywordAgentResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.messages.create({
    model: MODELS.cheap,
    max_tokens: 2048,
    temperature: 0.1,
    system: SYSTEM_PROMPT,
    messages: [
      { role: "user", content: `Keyword: "${phrase}"\n\nReturn only valid JSON.` },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const json = extractJson(text);
  const parsed = KeywordBriefSchema.parse(json);

  return {
    brief: parsed,
    tokensIn: response.usage?.input_tokens ?? 0,
    tokensOut: response.usage?.output_tokens ?? 0,
    model: MODELS.cheap,
  };
}

// Tolerate ```json fences or stray prose around the JSON.
function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const source = fenced ? fenced[1] : text;
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");
  const jsonStr = start !== -1 && end !== -1 ? source.slice(start, end + 1) : source;
  return JSON.parse(jsonStr);
}
