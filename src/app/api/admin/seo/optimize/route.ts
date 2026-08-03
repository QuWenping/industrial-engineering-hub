import { NextResponse } from "next/server";
import { optimizeContent } from "@/lib/ai/agents/content-optimizer";
import { recommendInternalLinks } from "@/lib/ai/agents/internal-link-agent";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const url = body.url as string;
  const type = body.type as "calculator" | "guide" | "material" | "service";
  const action = body.action as "optimize" | "links";

  if (!url || !type) {
    return NextResponse.json({ error: "url and type required" }, { status: 400 });
  }

  try {
    if (action === "links") {
      const result = await recommendInternalLinks(url, type);
      return NextResponse.json({ ok: true, ...result });
    } else {
      const result = await optimizeContent(url, type);
      return NextResponse.json({ ok: true, ...result });
    }
  } catch (err: any) {
    console.error("SEO optimize failed:", err);
    return NextResponse.json({ ok: false, error: err?.message || "Failed" }, { status: 500 });
  }
}
