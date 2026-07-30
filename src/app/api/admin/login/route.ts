import { NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/auth/password";
import { signSession, setSessionCookieHeader } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { password?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.password || typeof body.password !== "string") {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  if (!verifyAdminPassword(body.password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const cookieValue = signSession();
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", setSessionCookieHeader(cookieValue));
  return response;
}
