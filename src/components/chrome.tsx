import type { ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CaretLeft,
  DotsThree,
  Flag,
  House,
  MapTrifold,
  Siren,
} from "phosphor-react-native";
import { hitSize, PressableScale, T } from "./primitives";
import { useApp } from "@/src/theme/Theme";
import { radius, space } from "@/src/theme/tokens";

export function Header({ title }: { title: string }) {
  const { colors } = useApp();
  const router = useRouter();
  return (
    <View style={styles.header}>
      <PressableScale
        quiet
        accessibilityLabel="Back"
        onPress={() => router.back()}
        hitSlop={8}
        style={styles.back}
      >
        <CaretLeft size={24} color={colors.ink} weight="bold" />
      </PressableScale>
      <T variant="h2" color={colors.ink} center style={{ flex: 1 }} accessibilityRole="header">
        {title}
      </T>
      <View style={{ width: hitSize }} />
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: object }) {
  const { colors } = useApp();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          shadowColor: "#000",
          borderColor: colors.imageOutline,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function ListRow({
  icon,
  title,
  subtitle,
  onPress,
  trailing,
  label,
}: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  trailing?: ReactNode;
  label?: string;
}) {
  const { colors } = useApp();
  return (
    <PressableScale
      quiet
      accessibilityLabel={label ?? title}
      accessibilityHint={subtitle}
      onPress={onPress}
      style={[styles.row, { borderBottomColor: colors.line }]}
    >
      {icon ? <View style={styles.rowIcon}>{icon}</View> : null}
      <View style={{ flex: 1, gap: 2 }}>
        <T variant="label" color={colors.text}>
          {title}
        </T>
        {subtitle ? (
          <T variant="caption" color={colors.muted}>
            {subtitle}
          </T>
        ) : null}
      </View>
      {trailing}
    </PressableScale>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const { colors } = useApp();
  return (
    <PressableScale
      quiet
      accessibilityLabel={label}
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.cta : colors.card,
          borderColor: selected ? colors.cta : colors.fieldBorder,
        },
      ]}
    >
      <T variant="label" color={selected ? colors.onCta : colors.ink} numberOfLines={2}>
        {label}
      </T>
    </PressableScale>
  );
}

export function Avatar({
  initials,
  size = 44,
}: {
  initials: string;
  size?: number;
}) {
  const { colors } = useApp();
  return (
    <View
      accessibilityElementsHidden
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.chip,
        borderWidth: 1,
        borderColor: colors.imageOutline,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <T variant="label" color={colors.cta}>
        {initials}
      </T>
    </View>
  );
}

export function BrandMark({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  const { colors } = useApp();
  const color = light ? "#FFFFFF" : colors.cta;
  return (
    <View style={{ alignItems: "center", gap: compact ? 4 : 8 }}>
      <View
        accessibilityElementsHidden
        style={{
          width: compact ? 44 : 56,
          height: compact ? 44 : 56,
          borderRadius: 16,
          borderWidth: 1.5,
          borderColor: color,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <T variant="label" color={color}>
          SS
        </T>
      </View>
    </View>
  );
}

const tabs = [
  { name: "index", label: "Home", icon: House },
  { name: "map", label: "Map", icon: MapTrifold },
  { name: "sos", label: "SOS", icon: Siren },
  { name: "reports", label: "Reports", icon: Flag },
  { name: "more", label: "More", icon: DotsThree },
] as const;

export function AppTabBar({ state }: { state: { index: number; routes: { name: string }[] } }) {
  const { colors } = useApp();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const current = state.routes[state.index]?.name;

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.tab,
          borderTopColor: colors.line,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      {tabs.map((tab) => {
        if (tab.name === "sos") {
          return (
            <PressableScale
              key="sos"
              accessibilityLabel="Emergency SOS"
              accessibilityHint="Opens the hold-to-alert screen. Nothing is sent until you hold."
              onPress={() => router.push("/sos")}
              style={styles.sosWrap}
            >
              <View style={[styles.sos, { backgroundColor: colors.dangerDeep }]}>
                <Siren size={22} color="#FFFFFF" weight="fill" />
                <T variant="caption" color="#FFFFFF" style={{ fontSize: 11, lineHeight: 14 }}>
                  SOS
                </T>
              </View>
            </PressableScale>
          );
        }
        const active = current === tab.name;
        const Icon = tab.icon;
        return (
          <PressableScale
            key={tab.name}
            quiet
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: active }}
            onPress={() => router.navigate(tab.name === "index" ? "/" : `/${tab.name}`)}
            style={styles.tab}
          >
            <Icon size={24} color={active ? colors.cta : colors.muted} weight={active ? "fill" : "regular"} />
            <T variant="caption" color={active ? colors.cta : colors.muted} style={{ fontSize: 12, lineHeight: 16 }}>
              {tab.label}
            </T>
          </PressableScale>
        );
      })}
    </View>
  );
}

export function Empty({ title }: { title: string }) {
  const { colors } = useApp();
  return (
    <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.line }]}>
      <T variant="body" color={colors.muted} center>
        {title}
      </T>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", minHeight: hitSize, marginBottom: space[2] },
  back: { width: hitSize, height: hitSize, alignItems: "center", justifyContent: "center" },
  card: {
    borderRadius: radius.card,
    padding: space[4],
    gap: space[2],
    borderWidth: StyleSheet.hairlineWidth,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  row: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: space[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: space[2],
  },
  rowIcon: { width: 36, alignItems: "center" },
  chip: {
    minHeight: hitSize,
    paddingHorizontal: space[4],
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: space[2],
    paddingHorizontal: space[2],
  },
  tab: { flex: 1, minHeight: hitSize, alignItems: "center", justifyContent: "center", gap: 2 },
  sosWrap: { flex: 1, alignItems: "center", marginTop: -18 },
  sos: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  },
  empty: { borderWidth: 1, borderRadius: radius.card, padding: space[6] },
});

export const tabIconWeight = Platform.OS === "ios" ? "regular" : "regular";
