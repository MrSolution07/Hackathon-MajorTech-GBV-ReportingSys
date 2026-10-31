import { errors } from "@/lib/copy";
import { clientIp, json, readJson } from "@/lib/http";
import { allowForm } from "@/lib/rate-limit";
import { saveContact } from "@/lib/store";
import { validateContact } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const input = await readJson(request);
  const parsed = validateContact(input);
  if (!parsed.ok) return json({ ok: false, message: errors.send, fields: parsed.fields }, 400);
  const gate = await allowForm(clientIp(request));
  if (gate !== "ok") return json({ ok: false, message: errors.send }, gate === "limited" ? 429 : 503);
  if (parsed.honeypot) return json({ ok: true });
  try {
    await saveContact(parsed.value);
    return json({ ok: true });
  } catch {
    console.error("contact write failed");
    return json({ ok: false, message: errors.send }, 503);
  }
}
