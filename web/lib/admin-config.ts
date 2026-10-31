function read(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export function allowlist(): string[] {
  return read("ADMIN_EMAIL")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function sessionSecret(): string | null {
  const value = read("ADMIN_SESSION_SECRET");
  if (value.length < 16) return null;
  return value;
}

/** Hash when set and well formed. Otherwise the plaintext env password, marked so the two are not interchangeable. */
export function adminMaterial(): string | null {
  const hash = read("ADMIN_PASSWORD_HASH");
  if (hash) return hash.startsWith("$2") ? hash : null;
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!password) return null;
  return `plain:${password}`;
}

export function adminConfigured(): boolean {
  return Boolean(sessionSecret() && adminMaterial() && allowlist().length);
}
