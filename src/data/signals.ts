import type { SignalLabel, SignalResult } from "./types";

const ORDER: SignalLabel[] = ["threat", "sexual violence", "coercion", "sexual harassment", "repeated contact"];

const PATTERNS: { label: SignalLabel; pattern: RegExp }[] = [
  { label: "sexual violence", pattern: /\brap(e|ed|es|ing|ist)s?\b/i },
  { label: "sexual violence", pattern: /\bmolest(ed|ing|s)?\b/i },
  { label: "sexual violence", pattern: /\bsexually assault/i },
  { label: "threat", pattern: /\brap(e|ed|es|ing)\b/i },
  { label: "threat", pattern: /\b(kill|murder|stab|shoot|strangle|beat)\b/i },
  { label: "threat", pattern: /\b(i('ll| will)|gonna|imma)\s+(find|hurt|come for)\b/i },
  { label: "threat", pattern: /\bi know (your|where)\b/i },
  { label: "threat", pattern: /\b(i('ll| will)|gonna)\s+hurt you\b/i },
  { label: "coercion", pattern: /\bpost it or\b/i },
  { label: "coercion", pattern: /\bor i (will|'ll|send)\b/i },
  { label: "coercion", pattern: /\bunless you\b/i },
  { label: "coercion", pattern: /\b(pay me|send money|or else)\b/i },
  { label: "coercion", pattern: /\bsend (the )?(pictures|photos|pics|images)\b/i },
  { label: "sexual harassment", pattern: /\b(nudes?|dick pic|send pics)\b/i },
  { label: "sexual harassment", pattern: /\bexplicit (photo|pic|image)s?\b/i },
  { label: "repeated contact", pattern: /\b(again and again|stop ignoring|answer me|i will keep|keep (messaging|texting|calling))\b/i },
];

function uncertaintyFor(found: Set<SignalLabel>): string {
  if (found.has("sexual violence")) {
    return "The wording is a sexual violence threat. A signal, not a legal finding.";
  }
  if (found.has("threat")) {
    return "The wording is a threat. A signal, not a legal finding.";
  }
  if (found.size) {
    return "These are patterns in the wording, not a decision that a crime happened.";
  }
  return "No strong pattern in this text. That is not a finding that nothing happened.";
}

export function localSignals(text: string): SignalResult {
  const found = new Set<SignalLabel>();
  for (const item of PATTERNS) {
    if (item.pattern.test(text)) found.add(item.label);
  }
  return {
    signals: ORDER.filter((label) => found.has(label)),
    uncertainty: uncertaintyFor(found),
    source: "phone",
  };
}

function asLabels(value: unknown): SignalLabel[] {
  if (!Array.isArray(value)) return [];
  return ORDER.filter((label) => value.includes(label));
}

async function geminiSignals(text: string): Promise<SignalResult | null> {
  const { firebaseApp } = await import("./firebase");
  if (!firebaseApp) return null;
  const { getAI, getGenerativeModel, GoogleAIBackend } = await import("firebase/ai");
  const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
  const model = getGenerativeModel(ai, {
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });
  const prompt = [
    "Label patterns in a message a person received.",
    'Return JSON only: {"signals": string[], "uncertainty": string}.',
    'signals may only include these exact strings: "threat", "sexual violence", "coercion", "sexual harassment", "repeated contact".',
    "A rape threat, or any threat to kill, stab, shoot, or beat someone, must include threat. A rape threat must also include sexual violence.",
    "uncertainty is one short sentence.",
    "Never say a crime occurred. Never name a guilty person. Never add facts that are not in the message.",
    "If unsure, return an empty signals array.",
    "Message:",
    text.slice(0, 4000),
  ].join("\n");
  const result = await model.generateContent(prompt);
  const raw = result.response.text();
  const parsed = JSON.parse(raw) as { signals?: unknown; uncertainty?: unknown };
  const signals = asLabels(parsed.signals);
  const uncertainty =
    typeof parsed.uncertainty === "string" && parsed.uncertainty.trim()
      ? parsed.uncertainty.trim().slice(0, 280)
      : "A model marked these patterns. This is not a legal finding.";
  return { signals, uncertainty, source: "gemini" };
}

export async function readSignals(text: string): Promise<SignalResult> {
  const local = localSignals(text);
  try {
    const remote = await Promise.race([
      geminiSignals(text),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000)),
    ]);
    if (!remote) return local;
    const signals = ORDER.filter((label) => local.signals.includes(label) || remote.signals.includes(label));
    if (local.signals.length && !remote.signals.length) return local;
    return {
      signals,
      uncertainty: local.signals.includes("sexual violence") ? local.uncertainty : remote.uncertainty || local.uncertainty,
      source: remote.signals.length ? "gemini" : "phone",
    };
  } catch {
    return local;
  }
}

export function signalNote(result: SignalResult): string {
  const names = result.signals.length ? result.signals.join(", ") : "no strong pattern";
  const checked =
    result.source === "gemini"
      ? "A model marked these patterns. Not a legal finding."
      : "Checked on this phone.";
  return `${names}. ${result.uncertainty} ${checked}`;
}
