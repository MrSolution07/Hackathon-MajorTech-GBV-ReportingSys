import "server-only";
import { cert, getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function parseServiceAccount(raw: string): ServiceAccount {
  const trimmed = raw.trim();
  const json = trimmed.startsWith("{") ? trimmed : Buffer.from(trimmed, "base64").toString("utf8");
  const parsed = JSON.parse(json) as { project_id?: string; client_email?: string; private_key?: string };
  if (!parsed.client_email || !parsed.private_key) throw new Error("Firebase admin is not configured");
  return { projectId: parsed.project_id, clientEmail: parsed.client_email, privateKey: parsed.private_key };
}

export function firebaseReady(): boolean {
  if (process.env.FIRESTORE_EMULATOR_HOST) return true;
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim());
}

function app(): App {
  if (getApps().length) return getApps()[0]!;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "demo-safestep";
  if (process.env.FIRESTORE_EMULATOR_HOST) return initializeApp({ projectId });
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw?.trim()) throw new Error("Firebase admin is not configured");
  const credentials = parseServiceAccount(raw);
  return initializeApp({
    credential: cert(credentials),
    projectId: credentials.projectId || projectId,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export function databaseId(): string {
  return process.env.FIRESTORE_DATABASE_ID || process.env.EXPO_PUBLIC_FIRESTORE_DATABASE || "safestep";
}

export function firestore(): Firestore {
  return getFirestore(app(), databaseId());
}

export function adminApp(): App {
  return app();
}
