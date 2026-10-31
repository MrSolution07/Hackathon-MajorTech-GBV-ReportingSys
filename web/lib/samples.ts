import "server-only";

/** Seeded fiction. Not written into the incidents collection, so it never lands on a person's account. */
export type SampleReport = {
  id: string;
  createdAt: number;
  type: "harassment" | "stalking" | "image";
  platform: string;
  occurredAt: string;
  summary: string;
  status: "saved" | "prepared" | "shared";
  entries: { kind: "words" | "signal"; text: string }[];
};

export const sampleReports: SampleReport[] = [
  {
    id: "sample-harassment",
    createdAt: Date.UTC(2026, 5, 12, 16, 12),
    type: "harassment",
    platform: "WhatsApp",
    occurredAt: "12 June, 6:12 PM",
    summary: "A classmate threatened to send pictures to her mother.",
    status: "saved",
    entries: [
      { kind: "words", text: "A classmate threatened to send pictures to her mother." },
      { kind: "words", text: "I know your class. Post it or I send the pictures to your mother." },
      { kind: "signal", text: "Threat, coercion. Not a legal finding." },
    ],
  },
  {
    id: "sample-stalking",
    createdAt: Date.UTC(2026, 5, 2, 21, 5),
    type: "stalking",
    platform: "SMS",
    occurredAt: "2 June, 11:05 PM",
    summary: "Repeated texts after she asked for space.",
    status: "prepared",
    entries: [
      { kind: "words", text: "Repeated texts after she asked for space." },
      { kind: "signal", text: "Repeated contact. Not a legal finding." },
    ],
  },
  {
    id: "sample-image",
    createdAt: Date.UTC(2026, 4, 20, 8, 2),
    type: "image",
    platform: "Instagram",
    occurredAt: "20 May, 8:02 AM",
    summary: "A note she already shared with the campus office.",
    status: "shared",
    entries: [
      { kind: "words", text: "A note she already shared with the campus office." },
      { kind: "words", text: "Sample only. No image is stored here." },
    ],
  },
];

export function sampleById(id: string): SampleReport | null {
  return sampleReports.find((item) => item.id === id) ?? null;
}
