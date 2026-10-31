import { currentAdmin } from "@/lib/current-admin";
import { json } from "@/lib/http";
import { asListItem } from "@/lib/report-shape";
import { loadOverview } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const email = await currentAdmin();
  if (!email) return json({ ok: false, message: "Sign in required." }, 401);
  const overview = await loadOverview();
  return json({ ...overview, reports: overview.reports.map(asListItem) });
}
