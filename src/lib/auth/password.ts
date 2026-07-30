// Constant-time admin password verification using SHA-256 + timingSafeEqual.
import crypto from "node:crypto";

const ITERATIONS = 1;
const KEY_LEN = 32;
const DIGEST = "sha256";

function hash(input: string): Buffer {
  // Salt-less, single-pass SHA-256. The point here is to never store the plaintext
  // password in .env and to compare in constant time. For a single-admin HTTP-site,
  // this is sufficient; rotate ADMIN_PASSWORD_HASH to invalidate password guesses.
  return crypto.createHash(DIGEST).update(input, "utf8").digest();
}

export function verifyAdminPassword(input: string): boolean {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored || !input) return false;

  const expected = Buffer.from(stored, "hex");
  if (expected.length !== 32) return false;

  const actual = hash(input);
  if (actual.length !== expected.length) return false;

  return crypto.timingSafeEqual(actual, expected);
}
