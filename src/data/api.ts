import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  type Firestore,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase";
import { signalNote } from "./signals";
import type { Entry, Incident, IncidentStatus, NewIncident, Notice } from "./types";

function asIncident(id: string, data: Record<string, unknown>): Incident {
  return {
    id,
    ownerId: String(data.ownerId ?? ""),
    type: data.type as Incident["type"],
    platform: String(data.platform ?? ""),
    occurredAt: String(data.occurredAt ?? ""),
    summary: String(data.summary ?? ""),
    status: data.status as IncidentStatus,
    sample: Boolean(data.sample),
    createdAt: Number(data.createdAt ?? 0),
    updatedAt: Number(data.updatedAt ?? 0),
  };
}

function asEntry(id: string, data: Record<string, unknown>): Entry {
  const entry: Entry = {
    id,
    kind: data.kind as Entry["kind"],
    body: String(data.body ?? ""),
    createdAt: Number(data.createdAt ?? 0),
  };
  if (Array.isArray(data.signals)) entry.signals = data.signals.map(String);
  if (typeof data.uncertainty === "string") entry.uncertainty = data.uncertainty;
  if (data.source === "gemini" || data.source === "phone") entry.source = data.source;
  return entry;
}

function asNotice(id: string, data: Record<string, unknown>): Notice {
  const notice: Notice = {
    id,
    title: String(data.title ?? ""),
    body: String(data.body ?? ""),
    createdAt: Number(data.createdAt ?? 0),
    read: Boolean(data.read),
  };
  if (typeof data.incidentId === "string") notice.incidentId = data.incidentId;
  return notice;
}

export async function listIncidents(store: Firestore, uid: string): Promise<Incident[]> {
  const snap = await getDocs(query(collection(store, "incidents"), where("ownerId", "==", uid)));
  return snap.docs
    .map((item) => asIncident(item.id, item.data()))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function listEntries(store: Firestore, incidentId: string): Promise<Entry[]> {
  const snap = await getDocs(collection(store, "incidents", incidentId, "entries"));
  return snap.docs
    .map((item) => asEntry(item.id, item.data()))
    .sort((a, b) => a.createdAt - b.createdAt);
}

export async function listNotices(store: Firestore, uid: string): Promise<Notice[]> {
  const snap = await getDocs(collection(store, "notifications", uid, "items"));
  return snap.docs
    .map((item) => asNotice(item.id, item.data()))
    .sort((a, b) => b.createdAt - a.createdAt);
}

async function addEntry(store: Firestore, incidentId: string, entry: Omit<Entry, "id">) {
  const ref = doc(collection(store, "incidents", incidentId, "entries"));
  const payload: Record<string, unknown> = {
    kind: entry.kind,
    body: entry.body,
    createdAt: entry.createdAt,
  };
  if (entry.signals) payload.signals = entry.signals;
  if (entry.uncertainty) payload.uncertainty = entry.uncertainty;
  if (entry.source) payload.source = entry.source;
  await setDoc(ref, payload);
}

export async function createIncident(store: Firestore, uid: string, input: NewIncident): Promise<string> {
  const now = Date.now();
  const incidentRef = doc(collection(store, "incidents"));
  await setDoc(incidentRef, {
    ownerId: uid,
    type: input.type,
    platform: input.platform.trim(),
    occurredAt: input.occurredAt.trim(),
    summary: input.summary.trim(),
    status: "saved",
    sample: Boolean(input.sample),
    createdAt: now,
    updatedAt: now,
  });
  await addEntry(store, incidentRef.id, {
    kind: "words",
    body: input.summary.trim(),
    createdAt: now,
  });
  if (input.message.trim()) {
    await addEntry(store, incidentRef.id, {
      kind: "words",
      body: input.message.trim(),
      createdAt: now + 1,
    });
  }
  if (input.signal) {
    await addEntry(store, incidentRef.id, {
      kind: "signal",
      body: signalNote(input.signal),
      signals: input.signal.signals,
      uncertainty: input.signal.uncertainty,
      source: input.signal.source,
      createdAt: now + 2,
    });
  }
  await setDoc(doc(collection(store, "notifications", uid, "items")), {
    title: "Incident saved",
    body: "A record was added to the timeline.",
    incidentId: incidentRef.id,
    createdAt: now,
    read: false,
  });
  return incidentRef.id;
}

export async function setIncidentStatus(store: Firestore, incident: Incident, status: IncidentStatus) {
  await updateDoc(doc(store, "incidents", incident.id), {
    status,
    updatedAt: Date.now(),
  });
}

export async function markNoticeRead(store: Firestore, uid: string, notice: Notice) {
  await updateDoc(doc(store, "notifications", uid, "items", notice.id), { read: true });
}

export async function attachPhoto(store: Firestore, uid: string, incidentId: string, uri: string) {
  if (!storage) throw new Error("Storage is not connected.");
  const response = await fetch(uri);
  const blob = await response.blob();
  const type = blob.type && blob.type.startsWith("image/") ? blob.type : "image/jpeg";
  const path = `users/${uid}/${incidentId}/${Date.now()}.jpg`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, blob, { contentType: type });
  const url = await getDownloadURL(fileRef);
  await addEntry(store, incidentId, {
    kind: "file",
    body: url,
    createdAt: Date.now(),
  });
}

const sampleMessage = "I know your class. Post it or I send the pictures to your mother.";

let sampleTask: Promise<void> | null = null;

export function ensureSample(store: Firestore, uid: string): Promise<void> {
  if (sampleTask) return sampleTask;
  sampleTask = (async () => {
    const existing = await listIncidents(store, uid);
    if (existing.some((item) => item.sample)) return;
    const { localSignals } = await import("./signals");
    await createIncident(store, uid, {
      type: "harassment",
      platform: "WhatsApp",
      occurredAt: "Today, 6:12 PM",
      summary: "A classmate threatened to send pictures to her mother.",
      message: sampleMessage,
      signal: localSignals(sampleMessage),
      sample: true,
    });
  })().finally(() => {
    sampleTask = null;
  });
  return sampleTask;
}

export async function deleteAccountData(store: Firestore, uid: string) {
  const incidents = await listIncidents(store, uid);
  for (const incident of incidents) {
    const entries = await listEntries(store, incident.id);
    for (const entry of entries) {
      await deleteDoc(doc(store, "incidents", incident.id, "entries", entry.id));
    }
    await deleteDoc(doc(store, "incidents", incident.id));
  }
  const notices = await listNotices(store, uid);
  for (const notice of notices) {
    await deleteDoc(doc(store, "notifications", uid, "items", notice.id));
  }
  await deleteDoc(doc(store, "users", uid)).catch(() => undefined);
  if (storage) {
    const folder = ref(storage, `users/${uid}`);
    const listed = await listAll(folder).catch(() => null);
    if (listed) {
      for (const item of listed.items) await deleteObject(item).catch(() => undefined);
    }
  }
}

export function connectedDb(): Firestore {
  if (!db) throw new Error("Firebase is not connected yet.");
  return db;
}
