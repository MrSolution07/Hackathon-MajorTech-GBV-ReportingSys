export const COOKIE_NAME = "safestep_admin";
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

type Payload = {
  email: string;
  exp: number;
  v: string;
};

const encoder = new TextEncoder();

function bytesToB64url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i] ?? 0);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function b64urlToBytes(value: string): Uint8Array<ArrayBuffer> | null {
  try {
    const pad = value.length % 4 === 0 ? "" : "=".repeat(4 - (value.length % 4));
    const binary = atob(value.replaceAll("-", "+").replaceAll("_", "/") + pad);
    const bytes = new Uint8Array(new ArrayBuffer(binary.length));
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

async function hmacKey(secret: string, usage: "sign" | "verify") {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [usage]);
}

export async function sessionVersion(secret: string, material: string): Promise<string> {
  const key = await hmacKey(secret, "sign");
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(material)));
  return bytesToB64url(sig).slice(0, 22);
}

export async function createSessionToken(email: string, secret: string, material: string): Promise<string> {
  const payload: Payload = {
    email: email.trim().toLowerCase(),
    exp: Date.now() + SESSION_TTL_MS,
    v: await sessionVersion(secret, material),
  };
  const body = bytesToB64url(encoder.encode(JSON.stringify(payload)));
  const key = await hmacKey(secret, "sign");
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(body)));
  return `${body}.${bytesToB64url(sig)}`;
}

export async function readSession(
  token: string,
  secret: string,
  material: string,
  emails: string[],
): Promise<{ email: string } | null> {
  if (!token || token.length > 4000) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const body = parts[0];
  const sig = parts[1];
  if (!body || !sig) return null;
  const sigBytes = b64urlToBytes(sig);
  const bodyBytes = b64urlToBytes(body);
  if (!sigBytes || !bodyBytes) return null;
  const key = await hmacKey(secret, "verify");
  const ok = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(body));
  if (!ok) return null;
  let payload: Partial<Payload>;
  try {
    payload = JSON.parse(new TextDecoder().decode(bodyBytes)) as Partial<Payload>;
  } catch {
    return null;
  }
  if (typeof payload.email !== "string" || typeof payload.exp !== "number" || typeof payload.v !== "string") return null;
  if (payload.exp < Date.now()) return null;
  if (payload.exp - Date.now() > SESSION_TTL_MS + 60_000) return null;
  const email = payload.email.trim().toLowerCase();
  if (!emails.includes(email)) return null;
  const current = await sessionVersion(secret, material);
  if (payload.v !== current) return null;
  return { email };
}
