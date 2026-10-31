import "server-only";
import type { DocumentData } from "firebase-admin/firestore";
import { contact, demo } from "./copy";
import { adminApp, firestore } from "./firebase-admin";
import type { ContactRow, DemoRow, Overview } from "./public-types";
import {
  asListItem,
  evidenceUrl,
  incidentLabel,
  incidentStatus,
  storagePathFromUrl,
  wordCount,
  type ReportDetail,
  type ReportListItem,
} from "./report-shape";
import { sampleById, sampleReports, type SampleReport } from "./samples";
import type { ContactValue, DemoValue } from "./validate";

function asMillis(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "object" && value !== null && "toMillis" in value) {
    const toMillis = (value as { toMillis?: unknown }).toMillis;
    if (typeof toMillis === "function") {
      const ms = toMillis.call(value);
      if (typeof ms === "number" && Number.isFinite(ms)) return ms;
    }
  }
  return 0;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function saveContact(value: ContactValue): Promise<void> {
  const createdAt = Date.now();
  const doc: Record<string, string | number> = {
    email: value.email,
    message: value.message,
    consentAt: createdAt,
    consentVersion: contact.consentVersion,
    createdAt,
  };
  if (value.name) doc.name = value.name;
  await firestore().collection("contacts").add(doc);
}

export async function saveDemo(value: DemoValue): Promise<void> {
  const createdAt = Date.now();
  const doc: Record<string, string | number> = {
    name: value.name,
    email: value.email,
    organisation: value.organisation,
    organisationType: value.organisationType,
    organisationSize: value.organisationSize,
    role: value.role,
    consentAt: createdAt,
    consentVersion: demo.consentVersion,
    createdAt,
  };
  if (value.phone) doc.phone = value.phone;
  if (value.message) doc.message = value.message;
  await firestore().collection("demoRequests").add(doc);
}

function sampleItem(item: SampleReport): ReportListItem {
  return asListItem({
    id: item.id,
    createdAt: item.createdAt,
    category: incidentLabel(item.type),
    status: incidentStatus(item.status),
    sample: true,
    words: wordCount(item.summary),
  });
}

function incidentListItem(id: string, data: DocumentData): ReportListItem {
  return asListItem({
    id,
    createdAt: asMillis(data.createdAt),
    category: incidentLabel(text(data.type)),
    status: incidentStatus(text(data.status)),
    sample: data.sample === true,
    words: wordCount(text(data.summary)),
  });
}

async function newest(name: string) {
  const collection = firestore().collection(name);
  try {
    return await collection.orderBy("createdAt", "desc").limit(200).get();
  } catch {
    return collection.limit(200).get();
  }
}

function mapContact(id: string, data: DocumentData): ContactRow {
  return {
    id,
    createdAt: asMillis(data.createdAt),
    name: text(data.name),
    email: text(data.email),
    message: text(data.message),
  };
}

function mapDemo(id: string, data: DocumentData): DemoRow {
  return {
    id,
    createdAt: asMillis(data.createdAt),
    name: text(data.name),
    email: text(data.email),
    organisation: text(data.organisation),
    organisationType: text(data.organisationType),
    organisationSize: text(data.organisationSize),
    role: text(data.role),
    phone: text(data.phone),
    message: text(data.message),
  };
}

export async function loadOverview(): Promise<Overview> {
  const samples = sampleReports.map(sampleItem);
  const week = Date.now() - 7 * 24 * 60 * 60 * 1000;
  try {
    const [incidents, contacts, demos] = await Promise.all([newest("incidents"), newest("contacts"), newest("demoRequests")]);
    const reports = [...incidents.docs.map((item) => incidentListItem(item.id, item.data())), ...samples].sort(
      (a, b) => b.createdAt - a.createdAt,
    );
    const contactRows = contacts.docs.map((item) => mapContact(item.id, item.data())).sort((a, b) => b.createdAt - a.createdAt);
    const demoRows = demos.docs.map((item) => mapDemo(item.id, item.data())).sort((a, b) => b.createdAt - a.createdAt);
    return {
      ok: true,
      liveError: false,
      stats: {
        reports: reports.length,
        newThisWeek: reports.filter((item) => item.createdAt >= week).length,
        contacts: contactRows.length,
        demos: demoRows.length,
      },
      reports: reports.map(asListItem),
      contacts: contactRows,
      demos: demoRows,
    };
  } catch {
    console.error("overview load failed");
    return {
      ok: true,
      liveError: true,
      stats: {
        reports: samples.length,
        newThisWeek: samples.filter((item) => item.createdAt >= week).length,
        contacts: null,
        demos: null,
      },
      reports: samples,
      contacts: null,
      demos: null,
    };
  }
}

async function signPath(path: string): Promise<string | null> {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!bucketName) return null;
  try {
    const { getStorage } = await import("firebase-admin/storage");
    const file = getStorage(adminApp()).bucket(bucketName).file(path);
    const [url] = await file.getSignedUrl({ action: "read", expires: Date.now() + 5 * 60 * 1000 });
    return url;
  } catch {
    console.error("signed url failed");
    return null;
  }
}

async function writeAudit(actor: string, reportId: string): Promise<boolean> {
  try {
    await firestore().collection("auditLog").add({ actor, reportId, at: Date.now() });
    return true;
  } catch {
    console.error("audit write failed");
    return false;
  }
}

export async function openReport(actor: string, id: string): Promise<ReportDetail | "missing" | "unavailable"> {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) return "missing";
  const sample = sampleById(id);
  if (sample) {
    if (!(await writeAudit(actor, id))) return "unavailable";
    return {
      id: sample.id,
      createdAt: sample.createdAt,
      category: incidentLabel(sample.type),
      status: incidentStatus(sample.status),
      sample: true,
      platform: sample.platform,
      occurredAt: sample.occurredAt,
      summary: sample.summary,
      entries: sample.entries.map((entry) => ({ kind: entry.kind, text: entry.text })),
    };
  }
  try {
    const snap = await firestore().collection("incidents").doc(id).get();
    if (!snap.exists) return "missing";
    if (!(await writeAudit(actor, id))) return "unavailable";
    const data = snap.data() ?? {};
    const entriesSnap = await snap.ref
      .collection("entries")
      .get()
      .catch(() => null);
    const entries: ReportDetail["entries"] = [];
    const docs = [...(entriesSnap?.docs ?? [])].sort((a, b) => asMillis(a.data().createdAt) - asMillis(b.data().createdAt));
    for (const entry of docs) {
      const body = entry.data();
      const kind = text(body.kind);
      const content = text(body.body);
      if (kind === "file") {
        const path = storagePathFromUrl(content);
        const signed = path ? await signPath(path) : null;
        entries.push({ kind: "file", url: evidenceUrl(content, signed) });
      } else if (kind === "words" || kind === "signal") {
        entries.push({ kind, text: content });
      }
    }
    return {
      id,
      createdAt: asMillis(data.createdAt),
      category: incidentLabel(text(data.type)),
      status: incidentStatus(text(data.status)),
      sample: data.sample === true,
      platform: text(data.platform),
      occurredAt: text(data.occurredAt),
      summary: text(data.summary),
      entries,
    };
  } catch {
    console.error("report open failed");
    return "unavailable";
  }
}
