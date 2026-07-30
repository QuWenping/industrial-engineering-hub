// GET    /api/admin/keywords/[id]    — fetch one
// PATCH  /api/admin/keywords/[id]    — update fields/notes
// DELETE /api/admin/keywords/[id]    — remove
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

const PatchSchema = z.object({
  notes: z.string().max(2000).optional(),
  priority: z.enum(["P0", "P1", "P2"]).optional(),
  intent: z
    .enum(["informational", "transactional", "navigational", "commercial"])
    .optional(),
  status: z.enum(["new", "analyzed", "assigned", "published"]).optional(),
});

export async function GET(_request: Request, { params }: Props) {
  const { id } = await params;
  const kw = await prisma.keyword.findUnique({ where: { id } });
  if (!kw) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(kw);
}

export async function PATCH(request: Request, { params }: Props) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const kw = await prisma.keyword.update({ where: { id }, data: parsed.data });
    return NextResponse.json(kw);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const { id } = await params;
  try {
    await prisma.keyword.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
