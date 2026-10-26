import { useState } from "react";
import { TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { MagnifyingGlass, ShieldCheck, X } from "phosphor-react-native";
import { Card } from "@/src/components/chrome";
import { MapArt } from "@/src/components/MapArt";
import { Button, hitSize, PressableScale, Screen, T } from "@/src/components/primitives";
import { useApp } from "@/src/theme/Theme";
import { radius, space } from "@/src/theme/tokens";

export default function MapScreen() {
  const router = useRouter();
  const { colors } = useApp();
  const [query, setQuery] = useState("");
  return (
    <Screen tabbed padded={false} footer={<View style={{ paddingHorizontal: 0 }}><Button label="Start Navigation" onPress={() => router.push("/route")} /></View>}>
      <View style={{ paddingHorizontal: space[5], paddingTop: space[3], gap: space[3] }}>
        <T variant="h2" color={colors.ink} accessibilityRole="header">Map</T>
        <View style={{ minHeight: 52, borderRadius: radius.input, borderWidth: 1.5, borderColor: colors.fieldBorder, backgroundColor: colors.card, flexDirection: "row", alignItems: "center", paddingLeft: space[4] }}>
          <MagnifyingGlass size={20} color={colors.ink} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search destination..."
            placeholderTextColor={colors.placeholder}
            accessibilityLabel="Search destination"
            autoFocus={false}
            style={{ flex: 1, fontFamily: "Inter_400Regular", fontSize: 16, color: colors.text, paddingHorizontal: space[3], paddingVertical: 12 }}
          />
          {query ? (
            <PressableScale quiet accessibilityLabel="Clear search" onPress={() => setQuery("")} style={{ width: hitSize, height: hitSize, alignItems: "center", justifyContent: "center" }}>
              <X size={18} color={colors.ink} />
            </PressableScale>
          ) : null}
        </View>
      </View>
      <View style={{ flex: 1, padding: space[5], gap: space[3] }}>
        <MapArt height={420} />
        <Card>
          <View style={{ flexDirection: "row", gap: space[3], alignItems: "center" }}>
            <ShieldCheck size={28} color={colors.cta} weight="duotone" />
            <View>
              <T variant="label" color={colors.ink}>Safe Route</T>
              <T variant="caption" color={colors.muted}>Low risk • 12 min • 3.2 km</T>
            </View>
          </View>
        </Card>
      </View>
    </Screen>
  );
}
