// GET /api/revalidate — optional webhook receiver for ISR revalidation.
// Mode A relies on Vercel's auto-deploy; this is a stub for Mode B / future use.
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const path = req.nextUrl.searchParams.get("path");
  const tag = req.nextUrl.searchParams.get("tag");

  if (path) revalidatePath(path, "page");
  if (tag) revalidateTag(tag, "default");

  return NextResponse.json({ revalidated: true, path, tag, now: Date.now() });
}
