import { View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowUp, Bus, PersonSimpleWalk, Taxi, Train } from "phosphor-react-native";
import { MapArt } from "@/src/components/MapArt";
import { Button, PressableScale, Screen, T } from "@/src/components/primitives";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

const modes = [
  { id: "walk", label: "Walk", icon: PersonSimpleWalk },
  { id: "taxi", label: "Taxi", icon: Taxi },
  { id: "bus", label: "Bus", icon: Bus },
  { id: "train", label: "Train", icon: Train },
];

export default function Navigate() {
  const router = useRouter();
  const { colors } = useApp();
  return (
    <Screen
      padded={false}
      scroll={false}
      footer={<Button variant="danger" label="End" onPress={() => router.replace("/(tabs)")} />}
    >
      <View style={{ paddingHorizontal: space[5], paddingTop: space[3], gap: space[3] }}>
        <View style={{ flexDirection: "row", gap: space[3], alignItems: "center" }}>
          <ArrowUp size={28} color={colors.cta} weight="bold" />
          <View style={{ flex: 1 }}>
            <T variant="caption" color={colors.muted}>Head south on</T>
            <T variant="h2" color={colors.ink}>Main St.</T>
          </View>
          <T variant="label" color={colors.cta}>300 m</T>
        </View>
      </View>
      <View style={{ flex: 1, padding: space[5] }}>
        <MapArt height={460} />
      </View>
      <View style={{ paddingHorizontal: space[5], gap: space[3] }}>
        <T variant="body" color={colors.ink}>12 min • 3.2 km • Arrive at 7:16 PM</T>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <PressableScale
                key={mode.id}
                quiet
                accessibilityLabel={mode.label}
                onPress={() => {
                  if (mode.id !== "walk") router.push("/transport");
                }}
                style={{ minWidth: 64, minHeight: 48, alignItems: "center", justifyContent: "center", gap: 4 }}
              >
                <Icon size={24} color={colors.cta} />
                <T variant="caption" color={colors.muted}>{mode.label}</T>
              </PressableScale>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}
