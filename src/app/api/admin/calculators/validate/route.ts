// POST /api/admin/calculators/validate — validate schema + run tests WITHOUT persisting.
// Used by the SchemaBuilder "Run Tests" button for instant feedback.
import { NextRequest, NextResponse } from "next/server";
import { validateCalculator } from "@/lib/calculator/validation";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = validateCalculator(body);
  return NextResponse.json(result);
}
