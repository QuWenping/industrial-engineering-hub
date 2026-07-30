// POST /api/admin/content/[id]/transition — explicit status transition endpoint
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { canTransition } from "@/lib/admin/status-machine";

type Params = Promise<{ id: string }>;

const Body = z.object({ to: z.string() });

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Body must be {to: string}" }, { status: 400 });
  }

  const existing = await prisma.contentItem.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!canTransition(existing.status, parsed.data.to)) {
    return NextResponse.json(
      { error: `Illegal transition ${existing.status} → ${parsed.data.to}` },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = { status: parsed.data.to };
  if (parsed.data.to === "published") data.publishedAt = new Date();

  const updated = await prisma.contentItem.update({ where: { id }, data });
  return NextResponse.json(updated);
}
