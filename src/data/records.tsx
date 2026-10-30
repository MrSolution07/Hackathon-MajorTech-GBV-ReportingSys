import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import {
  attachPhoto,
  createIncident,
  ensureSample,
  listEntries,
  markNoticeRead,
  setIncidentStatus,
} from "./api";
import { db } from "./firebase";
import { useSession } from "./session";
import type { Entry, Incident, IncidentStatus, NewIncident, Notice } from "./types";

type RecordsState = {
  incidents: Incident[];
  notices: Notice[];
  ready: boolean;
  saveIncident: (input: NewIncident) => Promise<string>;
  setStatus: (incident: Incident, status: IncidentStatus) => Promise<void>;
  addPhoto: (incidentId: string, uri: string) => Promise<void>;
  markRead: (notice: Notice) => Promise<void>;
  entriesFor: (incidentId: string) => Promise<Entry[]>;
};

const Ctx = createContext<RecordsState | null>(null);

function mapIncident(id: string, data: Record<string, unknown>): Incident {
  return {
    id,
    ownerId: String(data.ownerId ?? ""),
    type: data.type as Incident["type"],
    platform: String(data.platform ?? ""),
    occurredAt: String(data.occurredAt ?? ""),
    summary: String(data.summary ?? ""),
    status: (data.status as Incident["status"]) ?? "saved",
    sample: Boolean(data.sample),
    createdAt: Number(data.createdAt ?? 0),
    updatedAt: Number(data.updatedAt ?? 0),
  };
}

function mapNotice(id: string, data: Record<string, unknown>): Notice {
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

export function RecordsProvider({ children }: { children: ReactNode }) {
  const { user } = useSession();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!db || !user) {
      setIncidents([]);
      setNotices([]);
      setReady(true);
      return;
    }
    setReady(false);
    const store = db;
    const uid = user.uid;
    const stopIncidents = onSnapshot(
      query(collection(store, "incidents"), where("ownerId", "==", uid)),
      (snap) => {
        const next = snap.docs
          .map((item) => mapIncident(item.id, item.data()))
          .sort((a, b) => b.updatedAt - a.updatedAt);
        setIncidents(next);
        setReady(true);
        if (user.email && user.email === process.env.EXPO_PUBLIC_DEMO_EMAIL && !next.some((item) => item.sample)) {
          ensureSample(store, uid).catch(() => undefined);
        }
      },
      () => setReady(true),
    );
    const stopNotices = onSnapshot(
      collection(store, "notifications", uid, "items"),
      (snap) => {
        setNotices(
          snap.docs
            .map((item) => mapNotice(item.id, item.data()))
            .sort((a, b) => b.createdAt - a.createdAt),
        );
      },
      () => undefined,
    );
    return () => {
      stopIncidents();
      stopNotices();
    };
  }, [user]);

  const value = useMemo<RecordsState>(
    () => ({
      incidents,
      notices,
      ready,
      async saveIncident(input) {
        if (!db || !user) throw new Error("Firebase is not connected yet.");
        return createIncident(db, user.uid, input);
      },
      async setStatus(incident, status) {
        if (!db) throw new Error("Firebase is not connected yet.");
        await setIncidentStatus(db, incident, status);
      },
      async addPhoto(incidentId, uri) {
        if (!db || !user) throw new Error("Firebase is not connected yet.");
        await attachPhoto(db, user.uid, incidentId, uri);
      },
      async markRead(notice) {
        if (!db || !user) return;
        await markNoticeRead(db, user.uid, notice);
      },
      entriesFor(incidentId) {
        if (!db) return Promise.resolve([]);
        return listEntries(db, incidentId);
      },
    }),
    [incidents, notices, ready, user],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRecords() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useRecords outside RecordsProvider");
  return value;
}
