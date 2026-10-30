import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { deleteAccountData } from "./api";
import { auth, db } from "./firebase";
import { clearPhone } from "./local";

export type Account = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

type SessionState = {
  ready: boolean;
  user: Account | null;
  onPhone: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInDemo: () => Promise<void>;
  sendReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  removeAccount: () => Promise<void>;
};

const Ctx = createContext<SessionState | null>(null);

async function rememberUser(user: User, name?: string) {
  if (!db) return;
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const displayName = name || user.displayName || "there";
  if (!snap.exists()) {
    await setDoc(ref, { displayName, createdAt: Date.now() });
    return;
  }
  if (snap.data().displayName !== displayName) {
    await updateDoc(ref, { displayName });
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!auth);
  const [cloudUser, setCloudUser] = useState<User | null>(null);
  const [phoneUser, setPhoneUser] = useState<Account | null>(null);
  const user: Account | null = cloudUser
    ? { uid: cloudUser.uid, email: cloudUser.email, displayName: cloudUser.displayName }
    : phoneUser;

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (next) => {
      setCloudUser(next);
      setReady(true);
      if (next) rememberUser(next).catch(() => undefined);
    });
  }, []);

  const value = useMemo<SessionState>(
    () => ({
      ready,
      user,
      onPhone: !cloudUser && !!phoneUser,
      configured: Boolean(auth && db),
      async signIn(email, password) {
        if (!auth) throw new Error("Firebase is not connected yet.");
        await signInWithEmailAndPassword(auth, email.trim(), password);
      },
      async signUp(name, email, password) {
        if (!auth) throw new Error("Firebase is not connected yet.");
        const created = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(created.user, { displayName: name.trim() });
        await rememberUser(created.user, name.trim());
      },
      async signInDemo() {
        const openOnPhone = () =>
          setPhoneUser({
            uid: "local-demo",
            email: "lena.mokoena@safestep.app",
            displayName: "Lena Mokoena",
          });
        if (!auth) {
          openOnPhone();
          return;
        }
        const email = process.env.EXPO_PUBLIC_DEMO_EMAIL;
        const password = process.env.EXPO_PUBLIC_DEMO_PASSWORD;
        if (!email || !password) {
          openOnPhone();
          return;
        }
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
          const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
          if (code !== "auth/invalid-credential" && code !== "auth/user-not-found") {
            openOnPhone();
            return;
          }
          try {
            const created = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(created.user, { displayName: "Lena Mokoena" });
          } catch {
            openOnPhone();
          }
        }
        if (auth.currentUser && !auth.currentUser.displayName) {
          await updateProfile(auth.currentUser, { displayName: "Lena Mokoena" });
        }
      },
      async sendReset(email) {
        if (!auth) throw new Error("Firebase is not connected yet.");
        await sendPasswordResetEmail(auth, email.trim());
      },
      async signOut() {
        setPhoneUser(null);
        if (auth) await firebaseSignOut(auth);
      },
      async removeAccount() {
        if (phoneUser && !cloudUser) {
          await clearPhone();
          setPhoneUser(null);
          return;
        }
        if (!auth?.currentUser || !db) throw new Error("Firebase is not connected yet.");
        const current = auth.currentUser;
        await deleteAccountData(db, current.uid);
        await deleteUser(current);
      },
    }),
    [ready, user, cloudUser, phoneUser],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useSession outside SessionProvider");
  return value;
}
