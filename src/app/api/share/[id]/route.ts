// GET /api/share/[id] - retrieve shared result + increment views
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const share = await prisma.shareResult.findUnique({ where: { id } });
  if (!share) return NextResponse.json({ error: "Not found" }, { status: 404 });
  prisma.shareResult.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => {});
  return NextResponse.json({ ok: true, ...share });
}
