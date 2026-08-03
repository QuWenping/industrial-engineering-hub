// POST /api/share — create a shareable calculation result link
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { calculator, calculatorName, inputData, resultData, formula } = body;
  if (!calculator || !inputData || !resultData) {
    return NextResponse.json({ error: "calculator, inputData, resultData required" }, { status: 400 });
  }

  const share = await prisma.shareResult.create({
    data: {
      calculator,
      calculatorName: calculatorName || calculator,
      inputData,
      resultData,
      formula: formula || null,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.industrialengineeringstudio.com";
  return NextResponse.json({ ok: true, id: share.id, url: baseUrl + "/share/" + share.id });
}
