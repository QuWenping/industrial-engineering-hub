// POST /api/indexnow?secret=...&path=/tools/foo
// - No `path`: bulk-submit every URL from the sitemap to IndexNow (Bing/Yandex/Naver).
// - `path=/x`: submit a single changed path.
// Protected by REVALIDATE_SECRET. Call after content publish / redeploy.
import { NextRequest, NextResponse } from "next/server";
import { submitToIndexNow, submitPathToIndexNow } from "@/lib/seo/indexnow";
import { revalidatePath } from "next/cache";

// Reuse the sitemap generator to enumerate live URLs (same source of truth).
import sitemap from "@/app/sitemap";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://industrialengineeringstudio.com";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const path = req.nextUrl.searchParams.get("path");
  if (path) {
    revalidatePath(path, "page");
    await submitPathToIndexNow(path);
    return NextResponse.json({ ok: true, path, now: Date.now() });
  }

  const entries = sitemap();
  const urls = entries.map((e) => e.url);
  const r = await submitToIndexNow(urls);
  return NextResponse.json({
    submitted: urls.length,
    sample: urls.slice(0, 5),
    ...r,
    now: Date.now(),
  });
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }
  const entries = sitemap();
  return NextResponse.json({
    keyLocation: `${BASE_URL}/c89651c353098b057db3dd682b8b72e1.txt`,
    urlCount: entries.length,
    sample: entries.slice(0, 5).map((e) => e.url),
  });
}
