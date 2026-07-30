// HMAC-signed session cookie. No JWT library needed — we just sign a compact payload
// with ADMIN_SECRET and verify in constant time.
import crypto from "node:crypto";

export const SESSION_COOKIE_NAME = "ieh_admin_session";
const SEVEN_DAYS_SEC = 7 * 24 * 60 * 60;

function getSecret(): Buffer {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SECRET is not set. Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );
  }
  return Buffer.from(secret, "hex");
}

export interface SessionPayload {
  sub: "admin";
  exp: number; // unix seconds
}

export function signSession(): string {
  const exp = Math.floor(Date.now() / 1000) + SEVEN_DAYS_SEC;
  const payload = `sub=admin&exp=${exp}`;
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload, "utf8")
    .digest("hex");
  return `${payload}.${sig}`;
}

export function verifySession(cookie: string | undefined | null): SessionPayload | null {
  if (!cookie) return null;
  const dot = cookie.lastIndexOf(".");
  if (dot === -1) return null;

  const payload = cookie.slice(0, dot);
  const sig = cookie.slice(dot + 1);

  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(payload, "utf8")
    .digest("hex");

  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  const params = new URLSearchParams(payload);
  const sub = params.get("sub");
  const expStr = params.get("exp");
  if (sub !== "admin" || !expStr) return null;

  const exp = parseInt(expStr, 10);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return null;

  return { sub: "admin", exp };
}

export function setSessionCookieHeader(value: string): string {
  return `${SESSION_COOKIE_NAME}=${value}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SEVEN_DAYS_SEC}${
    process.env.NODE_ENV === "production" ? "; Secure" : ""
  }`;
}

export function clearSessionCookieHeader(): string {
  return `${SESSION_COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${
    process.env.NODE_ENV === "production" ? "; Secure" : ""
  }`;
}
