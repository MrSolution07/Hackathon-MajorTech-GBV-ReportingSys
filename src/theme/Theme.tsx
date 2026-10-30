import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AccessibilityInfo, useColorScheme } from "react-native";
import { darkColors, lightColors, type Colors } from "./tokens";

export type SchemePref = "system" | "light" | "dark";

type AppState = {
  colors: Colors;
  scheme: "light" | "dark";
  pref: SchemePref;
  setPref: (pref: SchemePref) => void;
  reduceMotion: boolean;
  language: string;
  setLanguage: (language: string) => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [pref, setPref] = useState<SchemePref>("light");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (alive) setReduceMotion(value);
    });
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  const scheme = pref === "system" ? (system === "dark" ? "dark" : "light") : pref;
  const colors = scheme === "dark" ? darkColors : lightColors;

  const value = useMemo(
    () => ({ colors, scheme, pref, setPref, reduceMotion, language, setLanguage }),
    [colors, scheme, pref, reduceMotion, language],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useApp outside AppProvider");
  return value;
}
