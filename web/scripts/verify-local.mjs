import { readFileSync } from "node:fs";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function loadEnv(path) {
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq);
    if (!process.env[key]) process.env[key] = trimmed.slice(eq + 1);
  }
}

loadEnv(new URL("../.env.local", import.meta.url));

const host = process.env.FIRESTORE_EMULATOR_HOST || "";
if (!/^(127\.0\.0\.1|localhost):\d+$/.test(host)) {
  console.error("Refusing to run unless FIRESTORE_EMULATOR_HOST is localhost.");
  process.exit(1);
}

const projectId = process.env.FIREBASE_PROJECT_ID || "demo-safestep";
const databaseId = process.env.FIRESTORE_DATABASE_ID || "safestep";
const app = initializeApp({ projectId });
const db = getFirestore(app, databaseId);
const base = process.env.WEB_ORIGIN || "http://127.0.0.1:3456";
const summary = "Synthetic record for the admin list. Not a real person.";
const email = process.env.ADMIN_EMAIL || "";
const password = process.env.ADMIN_PASSWORD || "";
if (!email || !password) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set for the local check.");
  process.exit(1);
}

const incident = await db.collection("incidents").add({
  ownerId: "synthetic-owner",
  type: "harassment",
  platform: "WhatsApp",
  occurredAt: "1 June, 9:00",
  summary,
  status: "saved",
  sample: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
await db.collection("incidents").doc(incident.id).collection("entries").add({
  kind: "words",
  body: summary,
  createdAt: Date.now(),
});

async function post(path, body, cookie) {
  const response = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  return { status: response.status, data, cookie: response.headers.getSetCookie?.() ?? [] };
}

const contact = await post("/api/contact", {
  name: "Lerato",
  email: "lerato@example.com",
  message: "Synthetic contact for the local check.",
  consent: true,
});
if (contact.status !== 200 || !contact.data?.ok) {
  console.error("contact submit failed", contact.status);
  process.exit(1);
}

const phoneRejected = await post("/api/contact", {
  name: "Lerato",
  email: "0849980630",
  message: "This should not be stored.",
  consent: true,
});
if (phoneRejected.status !== 400) {
  console.error("phone reply was accepted", phoneRejected.status);
  process.exit(1);
}

const demo = await post("/api/demo", {
  name: "Lerato",
  email: "lerato@example.com",
  organisation: "North Campus",
  organisationType: "Campus",
  organisationSize: "51–200",
  role: "Wellness lead",
  phone: "0820000000",
  message: "Synthetic demo for the local check.",
  consent: true,
});
if (demo.status !== 200 || !demo.data?.ok) {
  console.error("demo submit failed", demo.status);
  process.exit(1);
}

const honeypot = await post("/api/contact", {
  name: "Bot",
  email: "bot@example.com",
  message: "Do not store this honeypot.",
  consent: true,
  safestep_leave_blank: "https://example.invalid",
});
if (honeypot.status !== 200) {
  console.error("honeypot was not absorbed", honeypot.status);
  process.exit(1);
}

const openAdmin = await fetch(`${base}/admin`, { redirect: "manual" });
if (openAdmin.status !== 307 && openAdmin.status !== 302) {
  console.error("admin page was not gated", openAdmin.status);
  process.exit(1);
}

const overviewAnon = await fetch(`${base}/api/admin/overview`);
if (overviewAnon.status !== 401) {
  console.error("overview was readable without a session", overviewAnon.status);
  process.exit(1);
}

const login = await post("/api/admin/login", { email, password });
const setCookie = login.cookie.find((item) => item.startsWith("safestep_admin="));
if (login.status !== 200 || !setCookie) {
  console.error("admin login failed", login.status);
  process.exit(1);
}
const cookie = setCookie.split(";")[0];

const overview = await fetch(`${base}/api/admin/overview`, { headers: { cookie } });
const body = await overview.json();
const serial = JSON.stringify(body);
if (overview.status !== 200 || !body.reports?.some((item) => item.sample) || !body.reports?.some((item) => item.id === incident.id)) {
  console.error("overview missing sample or live row", overview.status);
  process.exit(1);
}
if (serial.includes(summary) || serial.includes("synthetic-owner") || serial.includes("Repeated texts after she asked for space")) {
  console.error("overview leaked narrative or an owner id");
  process.exit(1);
}
if (!body.contacts?.some((item) => item.email === "lerato@example.com")) {
  console.error("contact row missing");
  process.exit(1);
}
if (body.contacts.some((item) => item.email === "bot@example.com")) {
  console.error("honeypot was stored");
  process.exit(1);
}

const detail = await fetch(`${base}/api/admin/reports/${incident.id}`, { method: "POST", headers: { cookie } });
const detailBody = await detail.json();
if (detail.status !== 200 || detailBody.report?.summary !== summary) {
  console.error("detail did not return the live row", detail.status);
  process.exit(1);
}
if (detailBody.report.ownerId) {
  console.error("detail included an owner id");
  process.exit(1);
}

const sample = await fetch(`${base}/api/admin/reports/sample-stalking`, { method: "POST", headers: { cookie } });
const sampleBody = await sample.json();
if (sample.status !== 200 || !sampleBody.report?.summary) {
  console.error("sample detail failed", sample.status);
  process.exit(1);
}

const audits = await db.collection("auditLog").where("reportId", "in", [incident.id, "sample-stalking"]).get();
if (audits.size < 2) {
  console.error("audit log missing");
  process.exit(1);
}

console.log("local check ok");
