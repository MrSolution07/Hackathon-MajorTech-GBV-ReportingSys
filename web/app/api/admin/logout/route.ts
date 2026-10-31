import { json } from "@/lib/http";
import { clearSessionCookie } from "@/lib/session-cookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await clearSessionCookie();
  return json({ ok: true });
}
