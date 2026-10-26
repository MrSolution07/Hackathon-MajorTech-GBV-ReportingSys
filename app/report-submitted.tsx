import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle } from "phosphor-react-native";
import { Card } from "@/src/components/chrome";
import { Button, Screen, T } from "@/src/components/primitives";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function ReportSubmitted() {
  const router = useRouter();
  const { colors } = useApp();
  const { type } = useLocalSearchParams<{ type?: string }>();
  return (
    <Screen
      footer={
        <View style={{ gap: space[3] }}>
          <Button label="View Status" onPress={() => router.replace("/reports")} />
          <Button variant="outline" label="Back to Home" onPress={() => router.replace("/(tabs)")} />
        </View>
      }
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: space[4], minHeight: 360 }}>
        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.successBg, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.imageOutline }}>
          <CheckCircle size={56} color={colors.success} weight="fill" />
        </View>
        <T variant="title" color={colors.ink} center accessibilityRole="header">
          Report Submitted!
        </T>
        <T variant="body" color={colors.muted} center>
          Thank you for speaking up. Your report helps make our community safer.
        </T>
        <Card>
          <T variant="label" color={colors.ink}>Report #4532</T>
          <T variant="caption" color={colors.muted}>
            {type || "Harassment"} • 12 Apr 2025, 7:34 PM
          </T>
        </Card>
      </View>
    </Screen>
  );
}
