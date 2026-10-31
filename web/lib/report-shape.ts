export type ReportStatus = "new" | "reviewed" | "closed";

export type ReportListItem = {
  id: string;
  createdAt: number;
  category: string;
  status: ReportStatus;
  sample: boolean;
  words: number;
};

export type ReportEntry =
  | { kind: "words" | "signal"; text: string }
  | { kind: "file"; url: string | null };

export type ReportDetail = {
  id: string;
  createdAt: number;
  category: string;
  status: ReportStatus;
  sample: boolean;
  platform: string;
  occurredAt: string;
  summary: string;
  entries: ReportEntry[];
};

const labels: Record<string, string> = {
  harassment: "Harassment",
  image: "Image-based threat",
  deepfake: "Deepfake",
  doxxing: "Doxxing",
  impersonation: "Impersonation",
  stalking: "Cyberstalking",
};

export function incidentLabel(id: string): string {
  return labels[id] ?? "Incident";
}

export function incidentStatus(status: string): ReportStatus {
  if (status === "prepared") return "reviewed";
  if (status === "shared") return "closed";
  return "new";
}

export function wordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/** List rows carry a count, never the wording. Extra fields are dropped. */
export function asListItem(item: ReportListItem): ReportListItem {
  return {
    id: item.id,
    createdAt: item.createdAt,
    category: item.category,
    status: item.status,
    sample: item.sample,
    words: item.words,
  };
}

export function storagePathFromUrl(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  let path = "";
  if (url.hostname === "firebasestorage.googleapis.com") {
    const match = url.pathname.match(/\/o\/(.+)$/);
    if (!match?.[1]) return null;
    path = decodeURIComponent(match[1]);
  } else if (url.hostname === "storage.googleapis.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    path = decodeURIComponent(parts.slice(1).join("/"));
  } else {
    return null;
  }
  if (!path.startsWith("users/") || path.includes("..")) return null;
  return path;
}

/** Never pass a stored download URL, or its token, through to the browser. */
export function evidenceUrl(original: string, signed: string | null): string | null {
  if (!signed || signed === original) return null;
  let signedUrl: URL;
  try {
    signedUrl = new URL(signed);
  } catch {
    return null;
  }
  if (signedUrl.searchParams.has("token")) return null;
  try {
    const token = new URL(original).searchParams.get("token");
    if (token && signed.includes(token)) return null;
  } catch {
    if (original && signed.includes(original)) return null;
  }
  return signed;
}
