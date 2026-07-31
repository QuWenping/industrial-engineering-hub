// GET/POST /api/revalidate — optional webhook receiver for ISR revalidation.
// After revalidating a path, also notifies IndexNow (Bing/Yandex/Naver) so the
// changed URL is recrawled without logging into webmaster tools.
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { submitPathToIndexNow } from "@/lib/seo/indexnow";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const path = req.nextUrl.searchParams.get("path");
  const tag = req.nextUrl.searchParams.get("tag");

  let revalidated = false;
  if (path) {
    revalidatePath(path, "page");
    revalidated = true;
    // Best-effort IndexNow ping; never block on it.
    submitPathToIndexNow(path).catch((e) =>
      console.warn("[revalidate] indexnow failed:", e?.message)
    );
  }
  if (tag) revalidateTag(tag, "default");

  return NextResponse.json({ revalidated, path, tag, now: Date.now() });
}
