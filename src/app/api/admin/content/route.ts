// GET /api/admin/content — list content items (filter by kind/status)
// POST /api/admin/content — create new content item
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind") || undefined;
  const status = searchParams.get("status") || undefined;
  const take = Math.min(Number(searchParams.get("take") ?? 100), 500);
  const skip = Number(searchParams.get("skip") ?? 0);

  const where = {
    ...(kind ? { kind } : {}),
    ...(status ? { status } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.contentItem.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take,
      skip,
      include: { Keyword: true, _count: { select: { Review: true } } },
    }),
    prisma.contentItem.count({ where }),
  ]);

  return NextResponse.json({ items, total });
}

const CreateSchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "slug must be kebab-case"),
  kind: z.enum(["guide", "material"]),
  title: z.string().min(2).max(300),
  description: z.string().min(10).max(500),
  category: z.string().min(2).max(100).optional(),
  keywordId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Unique constraint on [kind, slug]
  const existing = await prisma.contentItem.findUnique({
    where: { kind_slug: { kind: parsed.data.kind, slug: parsed.data.slug } },
  });
  if (existing) {
    return NextResponse.json(
      { error: `A ${parsed.data.kind} with slug "${parsed.data.slug}" already exists` },
      { status: 409 }
    );
  }

  const item = await prisma.contentItem.create({
    data: {
      slug: parsed.data.slug,
      kind: parsed.data.kind,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      status: "keyword",
      bodyMdx: "",
      frontmatter: {},
      ...(parsed.data.keywordId ? { keywordId: parsed.data.keywordId } : {}),
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
