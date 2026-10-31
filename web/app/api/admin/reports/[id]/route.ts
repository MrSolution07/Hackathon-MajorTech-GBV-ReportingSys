import { errors } from "@/lib/copy";
import { currentAdmin } from "@/lib/current-admin";
import { json } from "@/lib/http";
import { openReport } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: Context) {
  const email = await currentAdmin();
  if (!email) return json({ ok: false, message: "Sign in required." }, 401);
  const { id } = await context.params;
  const report = await openReport(email, id);
  if (report === "missing") return json({ ok: false, message: errors.missing }, 404);
  if (report === "unavailable") return json({ ok: false, message: errors.open }, 503);
  return json({ ok: true, report });
}
