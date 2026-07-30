// GET /api/admin/calculators — list calculators (with optional status/category filter)
// POST /api/admin/calculators — create new (validates schema + tests before persisting)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { validateCalculator } from "@/lib/calculator/validation";
import { CalculatorSchema } from "@/lib/calculator/schema.zod";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const category = searchParams.get("category") || undefined;
  const take = Math.min(Number(searchParams.get("take") ?? 100), 500);
  const skip = Number(searchParams.get("skip") ?? 0);

  const where = {
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.calculator.findMany({
      where,
      orderBy: [{ priority: "asc" }, { name: "asc" }],
      take,
      skip,
    }),
    prisma.calculator.count({ where }),
  ]);

  return NextResponse.json({ items, total });
}

const CreateSchema = z.object({
  schema: CalculatorSchema,
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

  const { schema, keywordId } = parsed.data;

  const v = validateCalculator(schema);
  if (!v.valid) {
    return NextResponse.json(
      { error: "Validation failed", errors: v.errors, testResults: v.testResults },
      { status: 422 }
    );
  }

  // Do not allow "published" on create — go through review flow.
  const initialStatus = "draft";

  const calc = await prisma.calculator.create({
    data: {
      id: schema.id,
      name: schema.name,
      category: schema.category,
      priority: schema.priority,
      description: schema.description,
      schema: schema as unknown as object,
      status: initialStatus,
      testsPass: v.testResults?.passed ?? 0,
      testsFail: v.testResults?.failed ?? 0,
      ...(keywordId ? { keywordId } : {}),
    },
  });

  return NextResponse.json({ calculator: calc }, { status: 201 });
}
