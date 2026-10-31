import type { ReportStatus } from "./report-shape";

export function formatWhen(ms: number): string {
  if (!ms) return "—";
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Johannesburg",
  }).format(new Date(ms));
}

export function wordPreview(words: number): string {
  return `•••• ${words} ${words === 1 ? "word" : "words"}`;
}

export function statusClass(status: ReportStatus): string {
  if (status === "reviewed") return "pill-status pill-reviewed";
  if (status === "closed") return "pill-status pill-closed";
  return "pill-status pill-new";
}
