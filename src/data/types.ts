export const incidentTypes = [
  { id: "harassment", label: "Harassment" },
  { id: "image", label: "Image-based threat" },
  { id: "deepfake", label: "Deepfake" },
  { id: "doxxing", label: "Doxxing" },
  { id: "impersonation", label: "Impersonation" },
  { id: "stalking", label: "Cyberstalking" },
] as const;

export type IncidentType = (typeof incidentTypes)[number]["id"];

export function incidentLabel(id: string) {
  return incidentTypes.find((item) => item.id === id)?.label ?? "Incident";
}
export type IncidentStatus = "saved" | "prepared" | "shared";
export type EntryKind = "words" | "signal" | "file";
export type SignalSource = "gemini" | "phone";
export type SignalLabel = "threat" | "coercion" | "sexual harassment" | "repeated contact";

export type Incident = {
  id: string;
  ownerId: string;
  type: IncidentType;
  platform: string;
  occurredAt: string;
  summary: string;
  status: IncidentStatus;
  sample: boolean;
  createdAt: number;
  updatedAt: number;
};

export type Entry = {
  id: string;
  kind: EntryKind;
  body: string;
  signals?: string[];
  uncertainty?: string;
  source?: SignalSource;
  createdAt: number;
};

export type Notice = {
  id: string;
  title: string;
  body: string;
  incidentId?: string;
  createdAt: number;
  read: boolean;
};

export type SignalResult = {
  signals: SignalLabel[];
  uncertainty: string;
  source: SignalSource;
};

export type NewIncident = {
  type: IncidentType;
  platform: string;
  occurredAt: string;
  summary: string;
  message: string;
  signal: SignalResult | null;
  sample?: boolean;
};
