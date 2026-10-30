import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url))
    .toString()
    .split("\n")
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const app = initializeApp({
  apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.EXPO_PUBLIC_FIREBASE_APP_ID,
});
const auth = getAuth(app);
const db = getFirestore(app, env.EXPO_PUBLIC_FIRESTORE_DATABASE || "safestep");
const email = env.EXPO_PUBLIC_DEMO_EMAIL;
const password = env.EXPO_PUBLIC_DEMO_PASSWORD;

let user;
try {
  user = (await signInWithEmailAndPassword(auth, email, password)).user;
} catch {
  user = (await createUserWithEmailAndPassword(auth, email, password)).user;
}
if (!user.displayName) await updateProfile(user, { displayName: "Lena Mokoena" });
const userRef = doc(db, "users", user.uid);
const userSnap = await getDoc(userRef);
if (!userSnap.exists()) {
  await setDoc(userRef, { displayName: "Lena Mokoena", createdAt: Date.now() });
} else if (userSnap.data().displayName !== "Lena Mokoena") {
  await updateDoc(userRef, { displayName: "Lena Mokoena" });
}

const existing = await getDocs(query(collection(db, "incidents"), where("ownerId", "==", user.uid)));
if ([...existing.docs].some((item) => item.data().sample)) {
  console.log("sample already exists", user.uid);
  process.exit(0);
}

const now = Date.now();
const incident = doc(collection(db, "incidents"));
await setDoc(incident, {
  ownerId: user.uid,
  type: "harassment",
  platform: "WhatsApp",
  occurredAt: "Today, 6:12 PM",
  summary: "A classmate threatened to send pictures to her mother.",
  status: "saved",
  sample: true,
  createdAt: now,
  updatedAt: now,
});
await setDoc(doc(collection(db, "incidents", incident.id, "entries")), {
  kind: "words",
  body: "A classmate threatened to send pictures to her mother.",
  createdAt: now,
});
await setDoc(doc(collection(db, "incidents", incident.id, "entries")), {
  kind: "words",
  body: "I know your class. Post it or I send the pictures to your mother.",
  createdAt: now + 1,
});
await setDoc(doc(collection(db, "incidents", incident.id, "entries")), {
  kind: "signal",
  body: "threat, coercion. These are patterns in the wording, not a decision that a crime happened. Checked on this phone.",
  signals: ["threat", "coercion"],
  uncertainty: "These are patterns in the wording, not a decision that a crime happened.",
  source: "phone",
  createdAt: now + 2,
});
console.log("seeded", user.uid, incident.id);
