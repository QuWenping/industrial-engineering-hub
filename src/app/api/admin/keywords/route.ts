// GET /api/admin/keywords — list keywords (paginated)
// POST /api/admin/keywords — create a new keyword
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";

const CreateSchema = z.object({
  phrase: z.string().min(2).max(200),
  notes: z.string().max(2000).optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const take = Math.min(parseInt(searchParams.get("take") ?? "50", 10), 200);
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);

  const where = status ? { status } : {};
  const [items, total] = await Promise.all([
    prisma.keyword.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
    }),
    prisma.keyword.count({ where }),
  ]);

  return NextResponse.json({ items, total, take, skip });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const phrase = parsed.data.phrase.trim();
  const existing = await prisma.keyword.findUnique({ where: { phrase } });
  if (existing) {
    return NextResponse.json({ error: "Keyword already exists" }, { status: 409 });
  }

  const kw = await prisma.keyword.create({
    data: { phrase, notes: parsed.data.notes },
  });

  return NextResponse.json(kw, { status: 201 });
}
