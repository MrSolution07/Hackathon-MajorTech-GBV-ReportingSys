import type { ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, CaretLeft, Flag, House, MapTrifold } from "phosphor-react-native";
import { Glass } from "./Glass";
import { hitSize, PressableScale, T } from "./primitives";
import { useRecords } from "@/src/data/records";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export function Header({ title, back = true }: { title: string; back?: boolean }) {
  const { colors } = useApp();
  const router = useRouter();
  return (
    <View style={styles.header}>
      {back ? (
        <PressableScale quiet accessibilityLabel="Back" onPress={() => router.back()} hitSlop={8} style={styles.back}>
          <CaretLeft size={24} color={colors.ink} weight="bold" />
        </PressableScale>
      ) : null}
      <T variant="h2" color={colors.ink} style={{ flex: 1 }} accessibilityRole="header">
        {title}
      </T>
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: object }) {
  return <Glass style={style}>{children}</Glass>;
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

export function Avatar({ initials, size = 44 }: { initials: string; size?: number }) {
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
        borderColor: colors.edge,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <T variant="label" color={colors.accent}>
        {initials}
      </T>
    </View>
  );
}

export function BrandMark() {
  const { colors } = useApp();
  return (
    <View
      accessibilityElementsHidden
      style={{
        width: 56,
        height: 56,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.edge,
        backgroundColor: colors.glass,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={{ width: 18, height: 26, borderRadius: 4, backgroundColor: colors.cta }} />
    </View>
  );
}

const tabs = [
  { name: "index", label: "Home", icon: House },
  { name: "map", label: "Map", icon: MapTrifold },
  { name: "reports", label: "Records", icon: Flag },
  { name: "bell", label: "Alerts", icon: Bell },
] as const;

export function AppTabBar({ state }: { state: { index: number; routes: { name: string }[] } }) {
  const { colors } = useApp();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { notices } = useRecords();
  const unread = notices.filter((item) => !item.read).length;
  const current = state.routes[state.index]?.name;

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8), borderTopColor: colors.line, backgroundColor: colors.tab }]}>
      {tabs.map((tab) => {
        const active = current === tab.name;
        const Icon = tab.icon;
        return (
          <PressableScale
            key={tab.name}
            quiet
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: active }}
            onPress={() => router.navigate(tab.name === "index" ? "/(tabs)" : `/(tabs)/${tab.name}`)}
            style={styles.tab}
          >
            <View>
              <Icon size={24} color={active ? colors.accent : colors.muted} weight={active ? "fill" : "regular"} />
              {tab.name === "bell" && unread > 0 ? <View style={[styles.dot, { backgroundColor: colors.danger }]} /> : null}
            </View>
            <T variant="caption" color={active ? colors.accent : colors.muted} style={{ fontSize: 12, lineHeight: 16 }}>
              {tab.label}
            </T>
          </PressableScale>
        );
      })}
    </View>
  );
}

export function Empty({ title }: { title: string }) {
  return (
    <Glass>
      <T variant="body" color={useApp().colors.muted}>
        {title}
      </T>
    </Glass>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", minHeight: hitSize, marginBottom: space[2], gap: space[2] },
  back: { width: hitSize, height: hitSize, alignItems: "center", justifyContent: "center" },
  row: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: space[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: space[2],
  },
  rowIcon: { width: 36, alignItems: "center" },
  tabBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginHorizontal: space[4],
    marginBottom: space[2],
    borderRadius: 22,
    paddingTop: space[2],
    paddingHorizontal: space[2],
  },
  tab: { flex: 1, minHeight: hitSize, alignItems: "center", justifyContent: "center", gap: 2 },
  dot: {
    position: "absolute",
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export const tabIconWeight = Platform.OS === "ios" ? "regular" : "regular";
