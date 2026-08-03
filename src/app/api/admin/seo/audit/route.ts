import { NextResponse } from "next/server";
import { auditAllPages } from "@/lib/seo/audit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST() {
  try {
    const result = await auditAllPages();
    return NextResponse.json({ ok: true, ...result });
  } catch (err: any) {
    console.error("Audit failed:", err);
    return NextResponse.json({ ok: false, error: err?.message || "Audit failed" }, { status: 500 });
  }
}
