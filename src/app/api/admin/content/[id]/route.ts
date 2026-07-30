// GET/PATCH/DELETE /api/admin/content/[id]
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { canTransition } from "@/lib/admin/status-machine";

type Params = Promise<{ id: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const item = await prisma.contentItem.findUnique({
    where: { id },
    include: {
      Keyword: true,
      Review: { orderBy: { createdAt: "desc" } },
      AiTask: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

const PatchSchema = z.object({
  title: z.string().min(2).max(300).optional(),
  description: z.string().min(10).max(500).optional(),
  category: z.string().max(100).optional(),
  keywords: z.array(z.string()).max(30).optional(),
  bodyMdx: z.string().max(50000).optional(),
  frontmatter: z.record(z.string(), z.unknown()).optional(),
  status: z.string().optional(),
  seoScore: z.number().int().min(0).max(100).optional(),
  keywordId: z.string().nullable().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.contentItem.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Record<string, unknown> = { ...parsed.data };

  // Validate status transition
  if (parsed.data.status && parsed.data.status !== existing.status) {
    if (!canTransition(existing.status, parsed.data.status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${existing.status} to ${parsed.data.status}` },
        { status: 400 }
      );
    }
    if (parsed.data.status === "published") data.publishedAt = new Date();
  }

  // Slug is immutable after creation (don't allow changing)
  delete (data as any).slug;
  delete (data as any).kind;

  const updated = await prisma.contentItem.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const existing = await prisma.contentItem.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.status === "published") {
    return NextResponse.json(
      { error: "Cannot delete published content — archive first" },
      { status: 400 }
    );
  }
  await prisma.contentItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
