import { type ReactNode } from "react";
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { useApp } from "@/src/theme/Theme";
import { radius } from "@/src/theme/tokens";

export function Glass({
  children,
  style,
  pad = true,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  pad?: boolean;
}) {
  const { colors, scheme } = useApp();
  const frame = [
    styles.frame,
    { borderColor: colors.edge, backgroundColor: colors.glass },
    Platform.OS === "web"
      ? ({ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" } as ViewStyle)
      : null,
    style,
  ];
  const body = <View style={pad ? styles.pad : undefined}>{children}</View>;
  if (Platform.OS === "web") return <View style={frame}>{body}</View>;
  return (
    <BlurView intensity={scheme === "dark" ? 28 : 42} tint={scheme === "dark" ? "dark" : "light"} style={frame}>
      {body}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 1,
    borderRadius: radius.card,
    overflow: "hidden",
  },
  pad: { padding: 16, gap: 8 },
});
