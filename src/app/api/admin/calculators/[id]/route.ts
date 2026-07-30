// GET/PATCH/DELETE /api/admin/calculators/[id]
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { validateCalculator } from "@/lib/calculator/validation";
import { CalculatorSchema } from "@/lib/calculator/schema.zod";
import { canTransitionCalc } from "@/lib/admin/status-machine";

type Params = Promise<{ id: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const calc = await prisma.calculator.findUnique({ where: { id } });
  if (!calc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(calc);
}

const PatchSchema = z.object({
  schema: CalculatorSchema.optional(),
  status: z.string().optional(),
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

  const existing = await prisma.calculator.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Record<string, unknown> = {};

  if (parsed.data.schema) {
    if (parsed.data.schema.id !== id) {
      return NextResponse.json(
        { error: "Schema id must match URL id" },
        { status: 400 }
      );
    }
    const v = validateCalculator(parsed.data.schema);
    if (!v.valid) {
      return NextResponse.json(
        { error: "Validation failed", errors: v.errors, testResults: v.testResults },
        { status: 422 }
      );
    }
    data.schema = parsed.data.schema as unknown as object;
    data.name = parsed.data.schema.name;
    data.category = parsed.data.schema.category;
    data.priority = parsed.data.schema.priority;
    data.description = parsed.data.schema.description;
    data.testsPass = v.testResults?.passed ?? 0;
    data.testsFail = v.testResults?.failed ?? 0;

    // If tests fail and user is trying to advance past draft, block
    if ((v.testResults?.failed ?? 0) > 0 && parsed.data.status && parsed.data.status !== "draft") {
      return NextResponse.json(
        { error: "Cannot advance status while tests fail" },
        { status: 422 }
      );
    }
  }

  if (parsed.data.status !== undefined) {
    if (!canTransitionCalc(existing.status, parsed.data.status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${existing.status} to ${parsed.data.status}` },
        { status: 400 }
      );
    }
    data.status = parsed.data.status;
    if (parsed.data.status === "published") data.publishedAt = new Date();
  }

  if (parsed.data.keywordId !== undefined) {
    data.keywordId = parsed.data.keywordId;
  }

  const updated = await prisma.calculator.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  // Only allow deleting drafts to avoid accidental removal of published calcs
  const existing = await prisma.calculator.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.status === "published") {
    return NextResponse.json(
      { error: "Cannot delete published calculator — archive first" },
      { status: 400 }
    );
  }
  await prisma.calculator.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
