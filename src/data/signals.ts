import type { SignalLabel, SignalResult } from "./types";

const ORDER: SignalLabel[] = ["threat", "coercion", "sexual harassment", "repeated contact"];

const PATTERNS: { label: SignalLabel; pattern: RegExp }[] = [
  { label: "threat", pattern: /\bi know (your|where)\b/i },
  { label: "threat", pattern: /\b(i('ll| will)|gonna)\s+(find|hurt|kill|come)\b/i },
  { label: "threat", pattern: /\bsend (the )?(pictures|photos|pics|images)\b/i },
  { label: "coercion", pattern: /\bpost it or\b/i },
  { label: "coercion", pattern: /\bor i (will|'ll|send)\b/i },
  { label: "coercion", pattern: /\bunless you\b/i },
  { label: "coercion", pattern: /\b(pay me|send money|or else)\b/i },
  { label: "sexual harassment", pattern: /\b(nudes?|sexual|explicit (photo|pic|image))\b/i },
  { label: "repeated contact", pattern: /\b(again and again|stop ignoring|i will keep|keep (messaging|texting|calling))\b/i },
];

export function localSignals(text: string): SignalResult {
  const found = new Set<SignalLabel>();
  for (const item of PATTERNS) {
    if (item.pattern.test(text)) found.add(item.label);
  }
  const signals = ORDER.filter((label) => found.has(label));
  return {
    signals,
    uncertainty: signals.length
      ? "These are patterns in the wording, not a decision that a crime happened."
      : "No strong pattern in this text. That is not a finding that nothing happened.",
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
    'signals may only include these exact strings: "threat", "coercion", "sexual harassment", "repeated contact".',
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
    return remote;
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
