// Next.js 16 Proxy (replaces middleware). Protects /admin/* and /api/admin/* routes
// with an HMAC-signed session cookie. No Prisma/DB access here — pure HMAC verification
// keeps this compatible with whatever runtime Next picks for proxy.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

const ADMIN_PAGE_PATTERN = /^\/admin(\/|$)/;
const ADMIN_API_PATTERN = /^\/api\/admin(\/|$)/;
const PUBLIC_PATHS = ["/admin/login"];

function isPublicAdminPage(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPage = ADMIN_PAGE_PATTERN.test(pathname);
  const isApi = ADMIN_API_PATTERN.test(pathname);

  if (!isPage && !isApi) {
    return NextResponse.next();
  }

  // Always allow the login page and the login API endpoint.
  if (isPublicAdminPage(pathname) || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = verifySession(cookie);

  if (session) {
    return NextResponse.next();
  }

  if (isApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
