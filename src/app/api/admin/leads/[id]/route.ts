// GET    /api/admin/leads/[id]  — fetch one lead (full detail)
// PATCH  /api/admin/leads/[id]  — update status / notes
// DELETE /api/admin/leads/[id]  — remove (e.g. spam/test)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

const STATUSES = ["new", "contacted", "qualified", "won", "lost", "spam"] as const;

const PatchSchema = z.object({
  status: z.enum(STATUSES).optional(),
  notes: z.string().max(5000).optional(),
});

export async function GET(_request: Request, { params }: Props) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
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
    // Stamp contactedAt the first time status moves to "contacted".
    const data: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.status === "contacted") {
      data.contactedAt = new Date();
    }
    const lead = await prisma.lead.update({ where: { id }, data });
    return NextResponse.json(lead);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const { id } = await params;
  try {
    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
