import { NextResponse } from "next/server";

export function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export async function readJson(request: Request): Promise<unknown> {
  const length = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(length) && length > 20_000) return null;
  const type = request.headers.get("content-type") || "";
  if (!type.includes("application/json")) return null;
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) return first.slice(0, 80);
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 80);
  return "unknown";
}
