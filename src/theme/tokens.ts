/**
 * Colors sampled from Figma (splash 3:9, login 3:103).
 * Thumbnail artboards are ~171px wide, so type below is phone-size, not Figma px.
 *
 * Contrast (approx, light):
 * - #FFFFFF on #5930C5 ≈ 8:1
 * - #4E5788 on #F8F9FF ≈ 6.6:1
 * - #FFFFFF on #B41C2C ≈ 6.6:1
 * - #211477 on #FFFFFF > 8:1
 * Dark muted #D4CCEE on #1C1233 > 7:1
 *
 * NativeWind is not wired: Expo 58 has no verified NativeWind release pairing.
 * These tokens are the styling system (StyleSheet).
 */
export const lightColors = {
  canvas: "#F8F9FF",
  card: "#FFFFFF",
  ink: "#211477",
  text: "#1A1240",
  muted: "#4E5788",
  placeholder: "#4E5788",
  line: "#E4E7F5",
  input: "#FFFFFF",
  fieldBorder: "#E4E7F5",
  deep: "#21105D",
  deepEnd: "#27106C",
  cta: "#5930C5",
  ctaEnd: "#6138C6",
  onCta: "#FFFFFF",
  inverseBorder: "#BCCBEE",
  danger: "#B41C2C",
  dangerDeep: "#8E1522",
  onDanger: "#FFFFFF",
  success: "#0B6B43",
  successBg: "#E7F8EF",
  chip: "#F1EAFF",
  warning: "#8A4B08",
  warningBg: "#FFF4E5",
  shadow: "rgba(33, 20, 119, 0.08)",
  imageOutline: "rgba(0, 0, 0, 0.1)",
  map: "#E4EDF8",
  park: "#D5E6CF",
  road: "#F7FBFF",
  pin: "#1F9D62",
  pinHot: "#D24B4B",
  overlay: "rgba(18, 8, 40, 0.45)",
  tab: "#FFFFFF",
  status: "dark" as "dark" | "light",
};

export const darkColors: typeof lightColors = {
  canvas: "#120A22",
  card: "#1C1233",
  ink: "#EDE7FF",
  text: "#F6F3FF",
  muted: "#D4CCEE",
  placeholder: "#C8C0E4",
  line: "rgba(255,255,255,0.12)",
  input: "#241838",
  fieldBorder: "rgba(255,255,255,0.16)",
  deep: "#21105D",
  deepEnd: "#27106C",
  cta: "#5930C5",
  ctaEnd: "#6138C6",
  onCta: "#FFFFFF",
  inverseBorder: "#BCCBEE",
  danger: "#E15A68",
  dangerDeep: "#B41C2C",
  onDanger: "#FFFFFF",
  success: "#8EE0B8",
  successBg: "#123528",
  chip: "#2C2150",
  warning: "#F3C98A",
  warningBg: "#3A2A14",
  shadow: "rgba(0, 0, 0, 0.35)",
  imageOutline: "rgba(255, 255, 255, 0.1)",
  map: "#1A2740",
  park: "#1E332C",
  road: "#24344F",
  pin: "#3DDC97",
  pinHot: "#FF8B8B",
  overlay: "rgba(0, 0, 0, 0.55)",
  tab: "#1C1233",
  status: "light",
};

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
  card: 20,
  pill: 28,
  icon: 14,
  sheet: 24,
} as const;

export const type = {
  splash: 52,
  title: 28,
  h2: 22,
  body: 16,
  label: 14,
  caption: 14,
  button: 16,
} as const;
