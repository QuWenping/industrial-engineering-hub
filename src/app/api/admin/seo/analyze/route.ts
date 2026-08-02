// POST /api/admin/seo/analyze — run SEO Brain analysis on GSC data
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runSeoBrain } from "@/lib/ai/agents/seo-brain";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST() {
  try {
    const analysis = await runSeoBrain();
    return NextResponse.json({ ok: true, ...analysis });
  } catch (err: any) {
    console.error("SEO Brain failed:", err);
    return NextResponse.json({ ok: false, error: err?.message || "Analysis failed" }, { status: 500 });
  }
}

// GET — list recent AI decisions
export async function GET() {
  const decisions = await prisma.seoAiDecision.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return NextResponse.json({ items: decisions });
}
