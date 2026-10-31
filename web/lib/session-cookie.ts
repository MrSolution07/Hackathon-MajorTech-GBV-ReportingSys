import "server-only";
import { cookies } from "next/headers";
import { COOKIE_NAME, SESSION_TTL_MS } from "./session-token";

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, { ...options, maxAge: SESSION_TTL_MS / 1000 });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", { ...options, maxAge: 0 });
}
