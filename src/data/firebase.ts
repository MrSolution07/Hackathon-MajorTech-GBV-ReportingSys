import { Platform } from "react-native";
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, initializeAuth, type Auth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  memoryLocalCache,
  persistentLocalCache,
  type Firestore,
} from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { authPersistence } from "./auth-persistence";

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);

export const databaseId = process.env.EXPO_PUBLIC_FIRESTORE_DATABASE || "safestep";

function makeApp(): FirebaseApp | null {
  if (!firebaseConfigured) return null;
  return getApps()[0] ?? initializeApp(config as Required<typeof config>);
}

export const firebaseApp = makeApp();

function makeAuth(app: FirebaseApp): Auth {
  try {
    return initializeAuth(app, { persistence: authPersistence() });
  } catch {
    return getAuth(app);
  }
}

function makeDb(app: FirebaseApp): Firestore {
  const cache =
    Platform.OS === "web" ? persistentLocalCache() : memoryLocalCache();
  try {
    return initializeFirestore(app, { localCache: cache }, databaseId);
  } catch {
    return getFirestore(app, databaseId);
  }
}

export const auth = firebaseApp ? makeAuth(firebaseApp) : null;
export const db = firebaseApp ? makeDb(firebaseApp) : null;
export const storage = firebaseApp ? getStorage(firebaseApp) : null;

export type { FirebaseStorage };
