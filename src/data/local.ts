import AsyncStorage from "@react-native-async-storage/async-storage";
import { localSignals, signalNote } from "./signals";
import type { Entry, Incident, IncidentStatus, NewIncident, Notice } from "./types";

const KEY = "safestep.phone.v2";

export type PhoneBox = {
  incidents: Incident[];
  entries: Record<string, Entry[]>;
  notices: Notice[];
};

function empty(): PhoneBox {
  return { incidents: [], entries: {}, notices: [] };
}

async function write(box: PhoneBox) {
  await AsyncStorage.setItem(KEY, JSON.stringify(box));
}

function entry(id: string, kind: Entry["kind"], body: string, createdAt: number, extra?: Partial<Entry>): Entry {
  return { id, kind, body, createdAt, ...extra };
}

function signalEntry(id: string, text: string, createdAt: number): Entry {
  const signal = localSignals(text);
  return entry(id, "signal", signalNote(signal), createdAt, {
    signals: signal.signals,
    uncertainty: signal.uncertainty,
    source: "phone",
  });
}

function sample(): PhoneBox {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const rape = "I WILL RAPE YOU";
  const pictures = "Post the pictures or I send them to your mother and your class group.";
  const stalking = "Stop ignoring me. I will keep texting. I will find you after campus.";
  const dox = "I know where you live. Your number is on my story for everyone in Braamfontein.";

  const threat: Incident = {
    id: "wa-threat",
    ownerId: "local-demo",
    type: "harassment",
    platform: "WhatsApp",
    occurredAt: "Today, 6:12 PM",
    summary: "A man from her tutorial group sent a rape threat after she left the chat.",
    status: "saved",
    sample: true,
    createdAt: now - 2 * 60 * 60 * 1000,
    updatedAt: now,
  };
  const images: Incident = {
    id: "ig-images",
    ownerId: "local-demo",
    type: "image",
    platform: "Instagram",
    occurredAt: "Yesterday, 9:40 PM",
    summary: "He threatened to send private pictures to her mother and a class group.",
    status: "prepared",
    sample: true,
    createdAt: now - day,
    updatedAt: now - day + 1000,
  };
  const stalk: Incident = {
    id: "sms-stalk",
    ownerId: "local-demo",
    type: "stalking",
    platform: "SMS",
    occurredAt: "28 Oct, 11:05 PM",
    summary: "Repeated texts through the night after she stopped replying.",
    status: "saved",
    sample: true,
    createdAt: now - 3 * day,
    updatedAt: now - 3 * day,
  };
  const posted: Incident = {
    id: "fb-dox",
    ownerId: "local-demo",
    type: "doxxing",
    platform: "Facebook",
    occurredAt: "24 Oct, 4:18 PM",
    summary: "He posted her phone number and said he knows her residence.",
    status: "saved",
    sample: true,
    createdAt: now - 7 * day,
    updatedAt: now - 7 * day,
  };
  const older: Incident = {
    id: "mail-old",
    ownerId: "local-demo",
    type: "harassment",
    platform: "Email",
    occurredAt: "12 Oct, 8:02 AM",
    summary: "An earlier thread she already exported for the campus office.",
    status: "shared",
    sample: true,
    createdAt: now - 19 * day,
    updatedAt: now - 18 * day,
  };

  return {
    incidents: [threat, images, stalk, posted, older],
    entries: {
      [threat.id]: [
        entry("wa-1", "words", "Answer me.", now - 70 * 60 * 1000),
        entry("wa-2", "words", "Stop ignoring me.", now - 40 * 60 * 1000),
        signalEntry("wa-2s", "Stop ignoring me.", now - 39 * 60 * 1000),
        entry("wa-3", "words", rape, now - 5 * 60 * 1000),
        signalEntry("wa-3s", rape, now - 4 * 60 * 1000),
        entry("wa-4", "words", "Saved from WhatsApp. She has not replied.", now - 3 * 60 * 1000),
      ],
      [images.id]: [
        entry("ig-1", "words", "You sent those photos. They are mine now.", now - day),
        entry("ig-2", "words", pictures, now - day + 1000),
        signalEntry("ig-2s", pictures, now - day + 2000),
        entry("ig-3", "words", "Noted for a report on Instagram. Original images were not uploaded here.", now - day + 3000),
      ],
      [stalk.id]: [
        entry("sms-1", "words", "Why are you quiet.", now - 3 * day),
        entry("sms-2", "words", stalking, now - 3 * day + 1000),
        signalEntry("sms-2s", stalking, now - 3 * day + 2000),
        entry("sms-3", "words", "14 messages between 10:12 PM and 1:03 AM.", now - 3 * day + 3000),
      ],
      [posted.id]: [
        entry("fb-1", "words", dox, now - 7 * day),
        signalEntry("fb-1s", dox, now - 7 * day + 1000),
        entry("fb-2", "words", "Screenshot of the story is stored on this phone. Not an intimate image.", now - 7 * day + 2000),
      ],
      [older.id]: [
        entry("em-1", "words", "Stop writing to this address.", now - 19 * day),
        entry("em-2", "words", "Exported and handed to the campus gender office on 13 Oct.", now - 18 * day),
      ],
    },
    notices: [
      { id: "n1", title: "Incident saved", body: "WhatsApp threat is on the timeline.", incidentId: threat.id, createdAt: now, read: false },
      { id: "n2", title: "Reminder", body: "The Instagram record is marked prepared. It has not been shared.", incidentId: images.id, createdAt: now - 3_600_000, read: false },
      { id: "n3", title: "Reminder", body: "SMS thread from 28 Oct is still only saved.", incidentId: stalk.id, createdAt: now - 2 * day, read: true },
      { id: "n4", title: "Incident saved", body: "Facebook post is on the timeline.", incidentId: posted.id, createdAt: now - 7 * day, read: true },
      { id: "n5", title: "Incident saved", body: "Email thread was shared with the campus office.", incidentId: older.id, createdAt: now - 18 * day, read: true },
    ],
  };
}

export async function loadPhone(): Promise<PhoneBox> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) {
    const seeded = sample();
    await write(seeded);
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw) as PhoneBox;
    if (!parsed.incidents?.some((item) => item.id === "wa-threat")) {
      const seeded = sample();
      await write(seeded);
      return seeded;
    }
    return parsed;
  } catch {
    const seeded = sample();
    await write(seeded);
    return seeded;
  }
}

export async function savePhoneIncident(box: PhoneBox, uid: string, input: NewIncident): Promise<{ box: PhoneBox; id: string }> {
  const now = Date.now();
  const id = `inc-${now}`;
  const incident: Incident = {
    id,
    ownerId: uid,
    type: input.type,
    platform: input.platform.trim(),
    occurredAt: input.occurredAt.trim(),
    summary: input.summary.trim(),
    status: "saved",
    sample: Boolean(input.sample),
    createdAt: now,
    updatedAt: now,
  };
  const entries: Entry[] = [{ id: `${id}-w`, kind: "words", body: input.summary.trim(), createdAt: now }];
  if (input.message.trim()) {
    entries.push({ id: `${id}-m`, kind: "words", body: input.message.trim(), createdAt: now + 1 });
  }
  if (input.signal) {
    entries.push({
      id: `${id}-s`,
      kind: "signal",
      body: signalNote(input.signal),
      signals: input.signal.signals,
      uncertainty: input.signal.uncertainty,
      source: input.signal.source,
      createdAt: now + 2,
    });
  }
  const next: PhoneBox = {
    incidents: [incident, ...box.incidents],
    entries: { ...box.entries, [id]: entries },
    notices: [
      {
        id: `note-${now}`,
        title: "Incident saved",
        body: "A record was added to the timeline.",
        incidentId: id,
        createdAt: now,
        read: false,
      },
      ...box.notices,
    ],
  };
  await write(next);
  return { box: next, id };
}

export async function setPhoneStatus(box: PhoneBox, id: string, status: IncidentStatus): Promise<PhoneBox> {
  const next = {
    ...box,
    incidents: box.incidents.map((item) => (item.id === id ? { ...item, status, updatedAt: Date.now() } : item)),
  };
  await write(next);
  return next;
}

export async function markPhoneRead(box: PhoneBox, id: string): Promise<PhoneBox> {
  const next = {
    ...box,
    notices: box.notices.map((item) => (item.id === id ? { ...item, read: true } : item)),
  };
  await write(next);
  return next;
}

export async function addPhonePhoto(box: PhoneBox, incidentId: string, uri: string): Promise<PhoneBox> {
  const entries = box.entries[incidentId] ?? [];
  const next = {
    ...box,
    entries: {
      ...box.entries,
      [incidentId]: [...entries, { id: `file-${Date.now()}`, kind: "file" as const, body: uri, createdAt: Date.now() }],
    },
  };
  await write(next);
  return next;
}

export async function clearPhone() {
  await AsyncStorage.removeItem(KEY);
}

export { empty };
