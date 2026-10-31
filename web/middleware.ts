import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminMaterial, allowlist, sessionSecret } from "./lib/admin-config";
import { COOKIE_NAME, readSession } from "./lib/session-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin/login")) return NextResponse.next();
  const secret = sessionSecret();
  const material = adminMaterial();
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = secret && material && token ? await readSession(token, secret, material, allowlist()) : null;
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
