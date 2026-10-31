import "server-only";
import { cookies } from "next/headers";
import { adminMaterial, allowlist, sessionSecret } from "./admin-config";
import { COOKIE_NAME, readSession } from "./session-token";

export async function currentAdmin(): Promise<string | null> {
  const secret = sessionSecret();
  const material = adminMaterial();
  if (!secret || !material) return null;
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await readSession(token, secret, material, allowlist());
  return session?.email ?? null;
}
