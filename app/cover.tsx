import { View } from "react-native";
import { useRouter } from "expo-router";
import { PressableScale, Screen, T } from "@/src/components/primitives";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function Cover() {
  const router = useRouter();
  const { colors } = useApp();
  return (
    <Screen exit={false}>
      <View style={{ flex: 1, paddingTop: space[8], gap: space[5] }}>
        <T variant="title" accessibilityRole="header">
          Notes
        </T>
        {[0, 1, 2, 3, 4, 5].map((line) => (
          <View key={line} style={{ height: 1, backgroundColor: colors.line }} />
        ))}
      </View>
      <PressableScale
        quiet
        accessibilityLabel="Open SafeStep"
        onPress={() => router.replace("/(tabs)")}
        style={{ minHeight: 44, justifyContent: "center" }}
      >
        <T variant="caption" color={colors.muted}>
          Open SafeStep
        </T>
      </PressableScale>
    </Screen>
  );
}
