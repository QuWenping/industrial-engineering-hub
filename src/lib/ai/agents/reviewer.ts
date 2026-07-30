// Reviewer Agent — scores content draft on 4 dimensions and returns verdict.
// Model: Sonnet (strong). Used for both engineering accuracy and SEO review.
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { MODELS } from "../models";

export const FindingSchema = z.object({
  severity: z.enum(["error", "warn", "info"]),
  dimension: z.enum(["accuracy", "logic", "seo", "originality"]),
  message: z.string().min(3).max(1000),
  location: z.string().max(200).optional(), // section or formula reference
  suggestion: z.string().max(2000).optional(),
});

export const ReviewerOutputSchema = z.object({
  scores: z.object({
    accuracy: z.number().int().min(0).max(100),  // 40% weight
    logic: z.number().int().min(0).max(100),     // 30% weight
    seo: z.number().int().min(0).max(100),       // 20% weight
    originality: z.number().int().min(0).max(100), // 10% weight
  }),
  overall: z.number().int().min(0).max(100),
  verdict: z.enum(["publish", "revise", "rewrite"]),
  findings: z.array(FindingSchema).max(50),
  summary: z.string().max(2000),
});

export type ReviewerOutput = z.infer<typeof ReviewerOutputSchema>;

export interface ReviewerInput {
  kind: "guide" | "material";
  title: string;
  bodyMdx: string;
  keyword: string;
  formulas?: string[]; // extracted formula expressions for fact-checking
  targetKeyword?: string;
  reviewType?: "engineering" | "seo" | "full";
}

const SYSTEM_PROMPT = `You are a senior industrial engineering reviewer performing quality review on technical content for an engineering reference site.

You score the draft on four dimensions:

1. ACCURACY (40% weight): Are the formulas correct? Are engineering constants right? Are unit conversions correct? Are cited standards accurate? Are there dangerous engineering errors that could cause harm if applied?
2. LOGIC (30% weight): Is the reasoning flow coherent? Are derivations correct? Do examples match the formulas? Are there internal contradictions?
3. SEO (20% weight): Is the target keyword used naturally in headings/opening? Are there clear H2 sections? Is meta description compelling? Are FAQ present? Are there internal link opportunities missed?
4. ORIGINALITY (10% weight): Does it add engineering value beyond a textbook definition? Are there practical insights, real-world examples, rules of thumb?

Scoring guidelines:
- 90-100: Publication-ready, authoritative, no changes needed
- 75-89: Good, minor fixes acceptable
- 60-74: Needs revision (specific issues listed)
- <60: Major rewrite required

VERDICT thresholds on weighted overall:
- >= 85: "publish"
- 70-84: "revise" (actionable findings)
- <70: "rewrite"

CRITICAL checks:
- Flag any formula that is dimensionally inconsistent
- Flag any unit conversion errors (SI vs imperial)
- Flag any safety-critical statements that are wrong (pressure vessel, lifting, electrical)
- Flag plagiarism-like generic text that adds no value

Return STRICT JSON:
{
  "scores": {"accuracy": 0-100, "logic": 0-100, "seo": 0-100, "originality": 0-100},
  "overall": 0-100,
  "verdict": "publish"|"revise"|"rewrite",
  "findings": [{"severity":"error|warn|info","dimension":"accuracy|logic|seo|originality","message":"...","location":"...","suggestion":"..."}],
  "summary": "one-paragraph overall assessment"
}

No prose outside JSON. No markdown fences.`;

export interface ReviewerResult {
  output: ReviewerOutput;
  tokensIn: number;
  tokensOut: number;
  model: string;
}

export async function reviewContent(input: ReviewerInput): Promise<ReviewerResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  const anthropic = new Anthropic({ apiKey });

  const userMessage = buildUserPrompt(input);

  const response = await anthropic.messages.create({
    model: MODELS.strong,
    max_tokens: 4096,
    temperature: 0.1,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const json = extractJson(text);
  const parsed = ReviewerOutputSchema.parse(json);

  // Sanity: recompute overall if model's value diverges from weighted scores by >5
  const weighted = Math.round(
    parsed.scores.accuracy * 0.4 +
    parsed.scores.logic * 0.3 +
    parsed.scores.seo * 0.2 +
    parsed.scores.originality * 0.1
  );
  if (Math.abs(weighted - parsed.overall) > 5) {
    parsed.overall = weighted;
    if (weighted >= 85) parsed.verdict = "publish";
    else if (weighted >= 70) parsed.verdict = "revise";
    else parsed.verdict = "rewrite";
  }

  return {
    output: parsed,
    tokensIn: response.usage?.input_tokens ?? 0,
    tokensOut: response.usage?.output_tokens ?? 0,
    model: MODELS.strong,
  };
}

function buildUserPrompt(input: ReviewerInput): string {
  const parts = [
    `Content type: ${input.kind}`,
    `Title: ${input.title}`,
    `Primary keyword: ${input.keyword}`,
    `Review focus: ${input.reviewType ?? "full"}`,
    "",
  ];
  if (input.targetKeyword) parts.push(`Target SEO keyword: ${input.targetKeyword}`);
  if (input.formulas?.length) {
    parts.push("Formulas used (fact-check these):");
    for (const f of input.formulas) parts.push(`  - ${f}`);
    parts.push("");
  }
  parts.push("--- DRAFT START ---");
  parts.push(input.bodyMdx);
  parts.push("--- DRAFT END ---");
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
