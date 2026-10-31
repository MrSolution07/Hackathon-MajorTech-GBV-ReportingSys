import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { createSessionToken, readSession } from "../lib/session-token.ts";
import { asListItem, evidenceUrl, storagePathFromUrl, wordCount } from "../lib/report-shape.ts";
import { validateContact, validateDemo } from "../lib/validate.ts";

const root = join(import.meta.dirname, "..");

test("contact form accepts an email and rejects a phone number", () => {
  const email = validateContact({
    name: "Lerato",
    email: "lerato@example.com",
    message: "A question about the desk.",
    consent: true,
  });
  assert.equal(email.ok, true);
  if (email.ok && !email.honeypot) assert.equal(email.value.email, "lerato@example.com");

  const phone = validateContact({
    name: "Lerato",
    email: "0849980630",
    message: "A question about the desk.",
    consent: true,
  });
  assert.equal(phone.ok, false);

  const missing = validateContact({ name: "Lerato", message: "Hello", consent: true });
  assert.equal(missing.ok, false);
});

test("demo form keeps an optional phone and does not require a surname", () => {
  const saved = validateDemo({
    name: "Lerato",
    email: "lerato@example.com",
    organisation: "North Campus",
    organisationType: "Campus",
    organisationSize: "51-200",
    role: "Wellness lead",
    consent: true,
  });
  assert.equal(saved.ok, true);
  if (saved.ok && !saved.honeypot) {
    assert.equal(saved.value.name, "Lerato");
    assert.equal(saved.value.phone, null);
    assert.equal(saved.value.organisationSize, "51–200");
  }
});

test("list rows drop narrative", () => {
  const cleaned = asListItem({
    id: "abc",
    createdAt: 10,
    category: "Harassment",
    status: "new",
    sample: false,
    words: wordCount("Synthetic record for the admin list."),
    summary: "Synthetic record for the admin list.",
  } as never);
  assert.deepEqual(Object.keys(cleaned).sort(), ["category", "createdAt", "id", "sample", "status", "words"]);
  assert.equal(JSON.stringify(cleaned).includes("Synthetic record"), false);
});

test("evidence links do not keep download tokens", () => {
  const original = "https://firebasestorage.googleapis.com/v0/b/bucket/o/users%2Fuid%2Fincident%2F1.jpg?alt=media&token=secret-token";
  assert.equal(storagePathFromUrl(original), "users/uid/incident/1.jpg");
  assert.equal(evidenceUrl(original, null), null);
  assert.equal(evidenceUrl(original, original), null);
  assert.equal(evidenceUrl(original, "https://storage.googleapis.com/bucket/users/uid/incident/1.jpg?token=secret-token"), null);
  const signed = "https://storage.googleapis.com/bucket/users/uid/incident/1.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Signature=abc";
  assert.equal(evidenceUrl(original, signed), signed);
});

test("session cookie rejects tampering and old password material", async () => {
  const secret = randomBytes(24).toString("hex");
  const material = randomBytes(24).toString("hex");
  const token = await createSessionToken("admin@example.com", secret, material);
  const session = await readSession(token, secret, material, ["admin@example.com"]);
  assert.equal(session?.email, "admin@example.com");
  assert.equal(await readSession(token, secret, randomBytes(24).toString("hex"), ["admin@example.com"]), null);
  const flipped = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;
  assert.equal(await readSession(flipped, secret, material, ["admin@example.com"]), null);
});

test("rules do not open read and write", () => {
  for (const file of ["../../firestore.rules", "../../storage.rules"]) {
    const source = readFileSync(join(import.meta.dirname, file), "utf8").replace(/\/\/.*$/gm, "");
    assert.doesNotMatch(source, /allow\s+read\s*,\s*write\s*:\s*if\s+true/);
    assert.doesNotMatch(source, /allow\s+write\s*,\s*read\s*:\s*if\s+true/);
  }
});

test("public pages do not mention secrets, office hours, or a phone reply field", () => {
  const files = walk(join(root, "app")).concat(walk(join(root, "components")), [join(root, "lib/copy.ts")]);
  const blob = files.map((file) => readFileSync(file, "utf8")).join("\n");
  assert.equal(/office hours/i.test(blob), false);
  assert.equal(blob.includes("Email or phone"), false);
  assert.equal(blob.includes("ADMIN_PASSWORD"), false);
  assert.equal(blob.includes("FIREBASE_SERVICE_ACCOUNT"), false);
  assert.equal(blob.includes("Repeated texts after she asked for space"), false);
});

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "api" ? [] : walk(path);
    return path.endsWith(".ts") || path.endsWith(".tsx") ? [path] : [];
  });
}
