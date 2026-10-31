import { createHash } from "crypto";
import { firebaseReady, firestore } from "./firebase-admin";

const buckets = new Map<string, { start: number; count: number }>();

export function hashKey(purpose: string, ip: string): string {
  return createHash("sha256").update(`${purpose}\n${ip}`).digest("hex");
}

function memoryAllows(key: string, limit: number, windowMs: number): boolean {
  if (buckets.size > 2000) buckets.clear();
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now - bucket.start > windowMs) {
    buckets.set(key, { start: now, count: 1 });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}

class Limited extends Error {}

async function firestoreAllows(key: string, purpose: string, limit: number, windowMs: number): Promise<boolean> {
  const ref = firestore().collection("rateLimits").doc(key);
  try {
    await firestore().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const now = Date.now();
      let start = now;
      let count = 0;
      if (snap.exists) {
        const data = snap.data() ?? {};
        if (typeof data.start === "number" && now - data.start < windowMs) {
          start = data.start;
          count = typeof data.count === "number" ? data.count : 0;
        }
      }
      count += 1;
      if (count > limit) throw new Limited("limited");
      tx.set(ref, { start, count, purpose });
    });
    return true;
  } catch (error) {
    if (error instanceof Limited) return false;
    throw error;
  }
}

export async function allowForm(ip: string): Promise<"ok" | "limited" | "unavailable"> {
  const key = hashKey("form", ip);
  if (!memoryAllows(key, 10, 10 * 60 * 1000)) return "limited";
  try {
    const allowed = await firestoreAllows(key, "form", 10, 10 * 60 * 1000);
    return allowed ? "ok" : "limited";
  } catch {
    console.error("rate limit check failed");
    return "unavailable";
  }
}

export async function allowLogin(ip: string): Promise<boolean> {
  const key = hashKey("login", ip);
  if (!memoryAllows(key, 8, 15 * 60 * 1000)) return false;
  if (!firebaseReady()) return true;
  try {
    return await firestoreAllows(key, "login", 8, 15 * 60 * 1000);
  } catch {
    console.error("login rate limit check failed");
    return true;
  }
}
