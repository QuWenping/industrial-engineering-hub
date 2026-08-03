// POST /api/share/explain — AI explanation of calculation result
import { NextResponse } from "next/server";
import { callLLM } from "@/lib/ai/deepseek-client";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = [
  "You are an engineering expert explaining calculation results.",
  "Given a calculator name, inputs, and result, provide a brief engineering interpretation.",
  "Output as plain text (no JSON), 3-5 sentences, practical and professional.",
  "Include: what the result means, typical applications, and any important caveats.",
  "Keep it under 150 words. No markdown formatting.",
].join(" ");

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { calculatorName, inputs, result, formula } = body;
  if (!calculatorName || !result) {
    return NextResponse.json({ error: "calculatorName and result required" }, { status: 400 });
  }

  const inputStr = Object.entries(inputs || {}).map(([k, v]) => k + ": " + v).join(", ");
  const userPrompt = "Calculator: " + calculatorName + "\nInputs: " + inputStr + "\nResult: " + result.value + " " + result.unit + " (" + result.label + ")\nFormula: " + (formula || "N/A") + "\n\nProvide a brief engineering interpretation of this result.";

  try {
    const res = await callLLM({ system: SYSTEM_PROMPT, user: userPrompt, maxTokens: 500, temperature: 0.3 });
    return NextResponse.json({ ok: true, explanation: res.content });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "AI explanation failed" }, { status: 500 });
  }
}
