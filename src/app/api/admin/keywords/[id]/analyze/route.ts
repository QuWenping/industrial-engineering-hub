// POST /api/admin/keywords/[id]/analyze — run the Haiku keyword agent and persist.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeKeyword } from "@/lib/ai/agents/keyword";
import { estimateCost } from "@/lib/ai/pricing";

export const runtime = "nodejs";
export const maxDuration = 30;

type Props = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Props) {
  const { id } = await params;
  const kw = await prisma.keyword.findUnique({ where: { id } });
  if (!kw) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Create the AI task record first for traceability.
  const task = await prisma.aiTask.create({
    data: {
      agent: "keyword",
      status: "running",
      input: { phrase: kw.phrase },
      keywordId: kw.id,
    },
  });

  try {
    const result = await analyzeKeyword(kw.phrase);
    const costUsd = estimateCost(result.model, result.tokensIn, result.tokensOut);

    const [updatedKw] = await Promise.all([
      prisma.keyword.update({
        where: { id: kw.id },
        data: {
          intent: result.brief.intent,
          priority: result.brief.priority,
          volume: result.brief.volume_estimate,
          difficulty: result.brief.difficulty_estimate,
          brief: result.brief.brief as unknown as object,
          status: kw.status === "new" ? "analyzed" : kw.status,
        },
      }),
      prisma.aiTask.update({
        where: { id: task.id },
        data: {
          status: "done",
          output: result.brief,
          model: result.model,
          tokensIn: result.tokensIn,
          tokensOut: result.tokensOut,
          costUsd,
          finishedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json({ keyword: updatedKw, task });
  } catch (err) {
    await prisma.aiTask.update({
      where: { id: task.id },
      data: {
        status: "failed",
        error: err instanceof Error ? err.message : String(err),
        finishedAt: new Date(),
      },
    });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Agent failed" },
      { status: 500 }
    );
  }
}
