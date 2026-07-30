// Writer Agent — produces MDX guide or material body from a keyword/brief.
// Model: Sonnet (strong). Returns frontmatter + MDX body as a single MDX string.
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { MODELS } from "../models";

export const WriterOutputSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(320),
  category: z.string().min(2).max(80),
  keywords: z.array(z.string()).min(1).max(20),
  bodyMdx: z.string().min(200).max(20000),
  suggestedRelated: z.array(z.string()).max(10),
});

export type WriterOutput = z.infer<typeof WriterOutputSchema>;

export interface WriterInput {
  keyword: string;
  brief: {
    headline?: string;
    targetAudience?: string;
    painPoints?: string[];
    suggestedFormulas?: string[];
    outline?: { h2: string; points?: string[] }[];
  };
  kind: "guide" | "material";
  maxWords?: number;
  relatedSlugs?: { slug: string; name: string }[];
  existingCalculators?: { id: string; name: string }[];
}

const SYSTEM_PROMPT = `You are a senior industrial engineer and technical writer producing content for an SEO engineering reference site.

You write in clear, authoritative engineering English. Target audience: working mechanical/process/civil engineers.

MDX components you MUST use (they render as styled callouts/formulas/calculator CTAs):
- <Formula>...</Formula> for displayed equations (ASCII math; exponents ^, subscripts _, × multiply)
- <Calculator id="some-slug" label="Use the X Calculator" /> to link to a calculator tool
- <Info>...</Info>, <Warning>...</Warning>, <Tip>...</Tip> callouts for important notes
- Standard markdown: ## h2, ### h3, tables | col | col |, **bold**, \`code\`, bullet lists, numbered lists

Content requirements:
- 1200-1800 words for guides, 800-1200 for material references.
- Open with a 2-3 sentence definition paragraph.
- Include at least one real engineering formula wrapped in <Formula>.
- Cite relevant standards (ASME/API/ASTM/ISO/BS EN) where applicable.
- Include 3-5 FAQ Q&As at the end (use ## FAQ heading then **Q:** / **A:** pairs).
- Include at least one <Calculator id="..."/> link. Use only slugs that exist in the provided calculator list.
- Use **SI units** throughout; imperial units may be added in parentheses.
- Do NOT invent proprietary brand/model numbers; reference general types only.
- No markdown code fences around the body; output just the raw MDX.
- Do NOT include a top-level H1 (\`# Title\`) — that's generated from frontmatter.

Return STRICT JSON with this shape:
{
  "title": string,
  "description": string (150-320 chars for SEO meta),
  "category": string,
  "keywords": string[],
  "bodyMdx": string (the full MDX, starting with ## Introduction),
  "suggestedRelated": string[] (slugs of calculators/guides to link to)
}

No prose outside JSON. No \`\`\`json fences.`;

export interface WriterResult {
  output: WriterOutput;
  tokensIn: number;
  tokensOut: number;
  model: string;
}

export async function writeGuide(input: WriterInput): Promise<WriterResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  const anthropic = new Anthropic({ apiKey });

  const userMessage = buildUserPrompt(input);

  const response = await anthropic.messages.create({
    model: MODELS.strong,
    max_tokens: 8192,
    temperature: 0.25,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const json = extractJson(text);
  const parsed = WriterOutputSchema.parse(json);

  return {
    output: parsed,
    tokensIn: response.usage?.input_tokens ?? 0,
    tokensOut: response.usage?.output_tokens ?? 0,
    model: MODELS.strong,
  };
}

function buildUserPrompt(input: WriterInput): string {
  const parts = [
    `Target keyword: "${input.keyword}"`,
    `Content type: ${input.kind}`,
    `Target length: ~${input.maxWords ?? (input.kind === "guide" ? 1500 : 1000)} words`,
    "",
  ];

  if (input.brief.headline) parts.push(`Suggested headline: ${input.brief.headline}`);
  if (input.brief.targetAudience) parts.push(`Target audience: ${input.brief.targetAudience}`);
  if (input.brief.painPoints?.length)
    parts.push(`Pain points to address: ${input.brief.painPoints.join("; ")}`);
  if (input.brief.suggestedFormulas?.length)
    parts.push(`Formulas to include: ${input.brief.suggestedFormulas.join(", ")}`);

  if (input.brief.outline?.length) {
    parts.push("", "Suggested outline (adapt as needed):");
    for (const o of input.brief.outline) {
      parts.push(`- ## ${o.h2}`);
      for (const p of o.points ?? []) parts.push(`  - ${p}`);
    }
  }

  if (input.existingCalculators?.length) {
    parts.push("", "Existing calculators (use these slugs in <Calculator id='...'/>):");
    for (const c of input.existingCalculators.slice(0, 80)) {
      parts.push(`- ${c.id} — ${c.name}`);
    }
  }
  if (input.relatedSlugs?.length) {
    parts.push("", "Suggested related pages to link to (in suggestedRelated):");
    for (const r of input.relatedSlugs.slice(0, 20)) parts.push(`- ${r.slug}`);
  }

  return parts.join("\n");
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const source = fenced ? fenced[1] : text;
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");
  const jsonStr = start !== -1 && end !== -1 ? source.slice(start, end + 1) : source;
  return JSON.parse(jsonStr);
}
