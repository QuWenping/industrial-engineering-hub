// POST /api/admin/reviews — create a human review record
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const Body = z.object({
  contentId: z.string(),
  scoreAccuracy: z.number().int().min(0).max(100).optional(),
  scoreLogic: z.number().int().min(0).max(100).optional(),
  scoreSeo: z.number().int().min(0).max(100).optional(),
  scoreOrig: z.number().int().min(0).max(100).optional(),
  verdict: z.enum(["publish", "revise", "rewrite"]).optional(),
  comments: z.array(z.string()).max(50).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const content = await prisma.contentItem.findUnique({
    where: { id: parsed.data.contentId },
  });
  if (!content) return NextResponse.json({ error: "Content not found" }, { status: 404 });

  // Compute weighted overall if all scores provided
  let overall: number | undefined;
  const { scoreAccuracy, scoreLogic, scoreSeo, scoreOrig } = parsed.data;
  if (scoreAccuracy != null && scoreLogic != null && scoreSeo != null && scoreOrig != null) {
    overall = Math.round(scoreAccuracy * 0.4 + scoreLogic * 0.3 + scoreSeo * 0.2 + scoreOrig * 0.1);
  }

  const review = await prisma.review.create({
    data: {
      contentId: parsed.data.contentId,
      reviewer: "human",
      scoreAccuracy,
      scoreLogic,
      scoreSeo,
      scoreOrig,
      overall,
      verdict: parsed.data.verdict,
      comments: parsed.data.comments ? { items: parsed.data.comments } : undefined,
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}
