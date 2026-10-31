import { errors } from "@/lib/copy";

export async function postJson(
  url: string,
  payload: unknown,
): Promise<{ ok: true } | { ok: false; message: string; fields: Record<string, string> }> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json().catch(() => null)) as { ok?: boolean; message?: string; fields?: Record<string, string> } | null;
    if (response.ok && data?.ok) return { ok: true };
    return { ok: false, message: data?.message || errors.send, fields: data?.fields ?? {} };
  } catch {
    return { ok: false, message: errors.send, fields: {} };
  }
}
