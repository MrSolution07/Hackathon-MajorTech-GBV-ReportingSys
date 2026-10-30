/**
 * Highveld daylight through wet glass.
 * Button fill #1F6F62 with #F4FBF8 is about 5.7:1.
 * Night icons use accent #8ED9CE so they stay readable on #10211B.
 */
export const lightColors = {
  canvas: "#080a06",
  card: "#12150e",
  glass: "rgba(18,21,14,0.72)",
  edge: "rgba(242,242,235,0.14)",
  ink: "#f2f2eb",
  text: "#f2f2eb",
  muted: "#979a90",
  placeholder: "#979a90",
  line: "rgba(242,242,235,0.14)",
  input: "rgba(255,255,255,0.06)",
  fieldBorder: "rgba(242,242,235,0.16)",
  deep: "#080a06",
  deepEnd: "#12150e",
  cta: "#e7f2ec",
  ctaEnd: "#e7f2ec",
  accent: "#d7c4a3",
  onCta: "#10211b",
  inverseBorder: "rgba(242,242,235,0.2)",
  danger: "#ff8d86",
  dangerDeep: "#c43832",
  onDanger: "#fff7f6",
  success: "#d7c4a3",
  successBg: "rgba(198,241,53,0.12)",
  chip: "rgba(255,255,255,0.06)",
  warning: "#f2f2eb",
  warningBg: "rgba(198,241,53,0.12)",
  shadow: "rgba(0,0,0,0.4)",
  imageOutline: "rgba(242,242,235,0.14)",
  sun: "#6d8f14",
  leaf: "#8a4e1c",
  map: "#10140c",
  park: "#1c2117",
  road: "#1c2117",
  pin: "#d7c4a3",
  pinHot: "#ff8d86",
  overlay: "rgba(0,0,0,0.55)",
  tab: "rgba(16,20,10,0.9)",
  status: "light" as "dark" | "light",
};

export const darkColors: typeof lightColors = { ...lightColors, canvas: "#050705" };

export type Colors = typeof lightColors;

export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
} as const;

export const radius = {
  input: 16,
  card: 22,
  pill: 28,
  icon: 14,
  sheet: 24,
} as const;

export const type = {
  splash: 44,
  title: 40,
  h2: 22,
  body: 16,
  label: 15,
  caption: 14,
  button: 16,
} as const;
