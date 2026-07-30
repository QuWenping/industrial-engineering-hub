// GET /api/admin/ai-tasks — list AiTask records (paginated)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const agent = searchParams.get("agent") || undefined;
  const status = searchParams.get("status") || undefined;
  const take = Math.min(Number(searchParams.get("take") ?? 50), 200);
  const skip = Number(searchParams.get("skip") ?? 0);

  const where = {
    ...(agent ? { agent } : {}),
    ...(status ? { status } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.aiTask.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
      include: { Keyword: true, ContentItem: true },
    }),
    prisma.aiTask.count({ where }),
  ]);

  return NextResponse.json({ items, total });
}
