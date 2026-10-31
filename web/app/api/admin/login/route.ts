import { adminConfigured, adminMaterial, allowlist, sessionSecret } from "@/lib/admin-config";
import { passwordMatches } from "@/lib/admin-password";
import { errors } from "@/lib/copy";
import { clientIp, json, readJson } from "@/lib/http";
import { allowLogin } from "@/lib/rate-limit";
import { setSessionCookie } from "@/lib/session-cookie";
import { createSessionToken } from "@/lib/session-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!adminConfigured()) return json({ ok: false, message: errors.signInSetup }, 503);
  const input = await readJson(request);
  const body = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  if (typeof body.safestep_leave_blank === "string" && body.safestep_leave_blank.trim()) {
    return json({ ok: false, message: errors.signInMismatch }, 401);
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const fields: Record<string, string> = {};
  if (!email) fields.email = errors.emailRequired;
  if (!password) fields.password = errors.passwordRequired;
  if (Object.keys(fields).length) return json({ ok: false, message: errors.signInMismatch, fields }, 400);
  if (!(await allowLogin(clientIp(request)))) return json({ ok: false, message: errors.signInWait }, 429);
  const emailOk = allowlist().includes(email);
  const passwordOk = await passwordMatches(password);
  if (!emailOk || !passwordOk) return json({ ok: false, message: errors.signInMismatch }, 401);
  const secret = sessionSecret();
  const material = adminMaterial();
  if (!secret || !material) return json({ ok: false, message: errors.signInSetup }, 503);
  await setSessionCookie(await createSessionToken(email, secret, material));
  return json({ ok: true });
}
