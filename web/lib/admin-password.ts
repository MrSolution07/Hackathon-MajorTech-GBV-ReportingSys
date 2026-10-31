import "server-only";
import bcrypt from "bcryptjs";
import { createHash, timingSafeEqual } from "crypto";

function shaEqual(a: string, b: string): boolean {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

export async function passwordMatches(password: string): Promise<boolean> {
  if (!password || password.length > 1024) return false;
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim() ?? "";
  if (hash) {
    if (!hash.startsWith("$2")) return false;
    return bcrypt.compare(password, hash);
  }
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  return shaEqual(password, expected);
}
