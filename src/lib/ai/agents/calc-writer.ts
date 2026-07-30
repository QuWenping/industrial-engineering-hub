// Calc-Writer Agent — generates a full Calculator JSON object from a keyword/brief.
// Model: Sonnet (strong). Validates output with validateCalculator() and retries up to 3 times.
import Anthropic from "@anthropic-ai/sdk";
import { MODELS } from "../models";
import { CalculatorSchema, type ValidatedCalculator } from "@/lib/calculator/schema.zod";
import { validateCalculator } from "@/lib/calculator/validation";

const MAX_ATTEMPTS = 3;

const SYSTEM_PROMPT = `You are a senior industrial engineer building calculator tools for an engineering reference site.

You produce a complete calculator definition as STRICT JSON matching this TypeScript interface:

{
  "id": string,           // kebab-case, e.g. "pipe-flow-calculator" (lowercase, hyphens only, 2-80 chars)
  "name": string,         // human name, 2-200 chars
  "category": string,     // e.g. "Fluid Mechanics" / "Structural" / "Thermodynamics"
  "priority": "P0"|"P1"|"P2",
  "description": string,  // 10-2000 chars
  "seo": {
    "title": string,      // 5-120 chars, SEO title
    "description": string, // 10-320 chars
    "keyword": string     // primary keyword for the page
  },
  "formula": {
    "expression": string, // JavaScript math expression using input IDs. Math.sin, Math.PI, ** for power. Example: "Math.PI * (d/2)**2 * v"
    "unit": string,       // output unit e.g. "m³/s"
    "explanation"?: string // how formula works
  },
  "inputs": [             // 1-20 inputs
    {
      "id": string,       // camelCase or kebab-case e.g. "diameter" / "flowRate"
      "label": string,
      "type": "number"|"select"|"material",
      "unit"?: string,
      "required"?: boolean,
      "default"?: number|string,
      "min"?: number,
      "max"?: number,
      "step"?: number,
      "options"?: [{"value":string,"label":string}],  // required for select
      "placeholder"?: string,
      "hint"?: string
    }
  ],
  "result": {
    "label": string,
    "unit": string,
    "decimals"?: number,  // 0-10
    "prefix"?: string     // e.g. "$"
  },
  "content": {
    "introduction": string, // 1-5000 chars
    "example"?: {"inputs":{...},"result":number,"description"?:"..."},
    "faq"?: [{"q":string,"a":string}],
    "related"?: string[],  // related calculator IDs
    "applications"?: string[],
    "formula_explanation"?: string
  },
  "tests": [              // at least 3 test cases — these MUST pass
    {
      "inputs": { "inputId": number|string },
      "expected": number, // correct answer
      "tolerance": number, // allowed absolute error e.g. 0.01
      "description"?: string
    }
  ]
}

ENGINEERING RULES:
- Use SI units as primary; imperial in parentheses if useful.
- The formula.expression is evaluated as JavaScript. Input IDs become variable names. Use standard Math.* functions.
- Tests MUST be mathematically correct: compute the expected value by hand or calculator before writing it.
- For material selectors, include common engineering materials (Carbon Steel A36, Aluminum 6061, Stainless 304, etc.).
- Include at least 3 tests covering typical, edge, and boundary inputs.
- Related calculator IDs must come from the provided existing calculator list when possible.

Return ONLY the JSON object. No markdown fences, no prose before or after.`;

export interface CalcWriterInput {
  keyword: string;
  brief: {
    headline?: string;
    targetAudience?: string;
    painPoints?: string[];
    suggestedFormulas?: string[];
    outline?: { h2: string; points?: string[] }[];
  };
  existingCalculators?: { id: string; name: string; category: string }[];
  materialsAvailable?: string[];
}

export interface CalcWriterResult {
  calculator: ValidatedCalculator;
  attempts: number;
  lastErrors?: string[];
  tokensIn: number;
  tokensOut: number;
  model: string;
}

export async function writeCalculator(input: CalcWriterInput): Promise<CalcWriterResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  const anthropic = new Anthropic({ apiKey });

  let totalIn = 0;
  let totalOut = 0;
  let lastErrors: string[] = [];
  let conversationHistory: { role: "user" | "assistant"; content: string }[] = [];

  const basePrompt = buildBaseUserPrompt(input);
  conversationHistory.push({ role: "user", content: basePrompt });

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const response = await anthropic.messages.create({
      model: MODELS.strong,
      max_tokens: 8192,
      temperature: 0.2,
      system: SYSTEM_PROMPT,
      messages: conversationHistory,
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    totalIn += response.usage?.input_tokens ?? 0;
    totalOut += response.usage?.output_tokens ?? 0;

    let json: unknown;
    try {
      json = extractJson(text);
    } catch {
      lastErrors = ["Failed to parse JSON from model output"];
      conversationHistory.push(
        { role: "assistant", content: text.slice(0, 2000) },
        { role: "user", content: `Your response was not valid JSON. Please return ONLY a valid JSON object matching the schema, no markdown fences.` }
      );
      continue;
    }

    // Zod parse
    const zodResult = CalculatorSchema.safeParse(json);
    if (!zodResult.success) {
      const errors = zodResult.error.issues.map(
        (i) => `${i.path.join(".") || "schema"}: ${i.message}`
      );
      lastErrors = errors;
      conversationHistory.push(
        { role: "assistant", content: text.slice(0, 2000) },
        {
          role: "user",
          content:
            `Schema validation FAILED on attempt ${attempt}:\n${errors.join("\n")}\n\n` +
            `Fix all these errors and return a corrected complete JSON object.`,
        }
      );
      continue;
    }

    // Engine runTests
    const validation = validateCalculator(zodResult.data);
    if (!validation.valid) {
      lastErrors = validation.errors;
      conversationHistory.push(
        { role: "assistant", content: JSON.stringify(zodResult.data).slice(0, 2000) },
        {
          role: "user",
          content:
            `Calculator engine tests FAILED on attempt ${attempt}:\n${validation.errors.join("\n")}\n\n` +
            `This means the formula or the expected test values are WRONG. Re-derive the math carefully. ` +
            `Common mistakes: wrong units, wrong constant, formula typo, incorrect expected value. ` +
            `Return a corrected complete JSON object with mathematically correct tests.`,
        }
      );
      continue;
    }

    // Success!
    return {
      calculator: zodResult.data,
      attempts: attempt,
      tokensIn: totalIn,
      tokensOut: totalOut,
      model: MODELS.strong,
    };
  }

  throw new Error(
    `Calc writer failed after ${MAX_ATTEMPTS} attempts. Last errors: ${lastErrors.join("; ")}`
  );
}

function buildBaseUserPrompt(input: CalcWriterInput): string {
  const parts = [
    `Build a calculator for: "${input.keyword}"`,
    "",
  ];
  if (input.brief.headline) parts.push(`Headline: ${input.brief.headline}`);
  if (input.brief.targetAudience) parts.push(`Audience: ${input.brief.targetAudience}`);
  if (input.brief.painPoints?.length)
    parts.push(`Pain points: ${input.brief.painPoints.join("; ")}`);
  if (input.brief.suggestedFormulas?.length)
    parts.push(`Formulas to consider: ${input.brief.suggestedFormulas.join(", ")}`);

  if (input.existingCalculators?.length) {
    parts.push("", "Existing calculator IDs (use in related[]):");
    for (const c of input.existingCalculators.slice(0, 100)) {
      parts.push(`- ${c.id} (${c.category}) — ${c.name}`);
    }
  }

  if (input.materialsAvailable?.length) {
    parts.push("", "Available material names (for material-select inputs):");
    parts.push(input.materialsAvailable.join(", "));
  }

  parts.push(
    "",
    "IMPORTANT: The tests array must contain AT LEAST 3 cases. Each expected value must be hand-verified — the engine will run your formula against these inputs and reject if it doesn't match within tolerance."
  );

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
