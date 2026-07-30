import { NextResponse } from "next/server";
import { clearSessionCookieHeader } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"), { status: 303 });
  response.headers.set("Set-Cookie", clearSessionCookieHeader());
  return response;
}
