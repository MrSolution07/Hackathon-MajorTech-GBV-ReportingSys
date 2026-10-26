import { View } from "react-native";
import { useRouter } from "expo-router";
import { MapTrifold, ShieldCheck } from "phosphor-react-native";
import { Header } from "@/src/components/chrome";
import { Button, PressableScale, Screen, T } from "@/src/components/primitives";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

const points = [
  "Safe & optional",
  "Location stays private",
  "Meet at a public place",
  "SOS always available",
];

export default function Walk() {
  const router = useRouter();
  const { colors } = useApp();
  return (
    <Screen footer={<Button label="Find a Match" onPress={() => router.push("/matches")} />}>
      <Header title="Walk Together" />
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <T variant="h2" color={colors.ink}>Find a walking buddy</T>
        <PressableScale quiet accessibilityLabel="Open map" onPress={() => router.push("/walk-map")} style={{ minWidth: 48, minHeight: 48, alignItems: "center", justifyContent: "center" }}>
          <MapTrifold size={24} color={colors.cta} />
        </PressableScale>
      </View>
      <T variant="body" color={colors.muted}>
        Match with other women heading to the same destination or along similar routes.
      </T>
      <View style={{ marginTop: space[4], gap: space[3] }}>
        {points.map((point) => (
          <View key={point} style={{ flexDirection: "row", gap: space[3], alignItems: "center", minHeight: 44 }}>
            <ShieldCheck size={22} color={colors.success} weight="fill" />
            <T variant="body">{point}</T>
          </View>
        ))}
      </View>
    </Screen>
  );
}
