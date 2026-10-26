import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { MagnifyingGlass, ShieldCheck, X } from "phosphor-react-native";
import { Avatar, Card } from "@/src/components/chrome";
import { MapArt } from "@/src/components/MapArt";
import { Button, hitSize, PressableScale, Screen, T } from "@/src/components/primitives";
import { useApp } from "@/src/theme/Theme";
import { radius, space } from "@/src/theme/tokens";
import { TextInput } from "react-native";

export default function Home() {
  const router = useRouter();
  const { colors } = useApp();
  const [query, setQuery] = useState("");
  return (
    <Screen tabbed footer={<Button label="Start Navigation" onPress={() => router.push("/route")} />}>
      <PressableScale
        quiet
        accessibilityLabel="Open profile for Nomsa Dlamini"
        onPress={() => router.push("/profile")}
        style={{ flexDirection: "row", alignItems: "center", gap: space[3], minHeight: hitSize, marginBottom: space[4] }}
      >
        <Avatar initials="ND" />
        <View>
          <T variant="label" color={colors.ink}>Hello, Thandi</T>
          <T variant="caption" color={colors.muted}>You’re safe with SafeStep</T>
        </View>
      </PressableScale>
      <View style={{ gap: space[3] }}>
        <View style={{ minHeight: 52, borderRadius: radius.input, borderWidth: 1.5, borderColor: colors.fieldBorder, backgroundColor: colors.card, flexDirection: "row", alignItems: "center", paddingLeft: space[4] }}>
          <MagnifyingGlass size={20} color={colors.ink} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search destination..."
            placeholderTextColor={colors.placeholder}
            accessibilityLabel="Search destination"
            style={{ flex: 1, fontFamily: "Inter_400Regular", fontSize: 16, color: colors.text, paddingHorizontal: space[3], paddingVertical: 12 }}
          />
          {query ? (
            <PressableScale quiet accessibilityLabel="Clear search" onPress={() => setQuery("")} hitSlop={8} style={{ width: hitSize, height: hitSize, alignItems: "center", justifyContent: "center" }}>
              <X size={18} color={colors.ink} />
            </PressableScale>
          ) : null}
        </View>
        {query.length > 0 ? (
          <Card>
            <T variant="label">Rosebank</T>
            <T variant="caption" color={colors.muted}>Suggested stop • low risk</T>
          </Card>
        ) : null}
        <MapArt height={320} />
        <Card>
          <View style={{ flexDirection: "row", gap: space[3], alignItems: "center" }}>
            <ShieldCheck size={28} color={colors.cta} weight="duotone" />
            <View style={{ flex: 1 }}>
              <T variant="label" color={colors.ink}>Safe Route</T>
              <T variant="caption" color={colors.muted}>Low risk • 12 min • 3.2 km</T>
            </View>
          </View>
        </Card>
      </View>
    </Screen>
  );
}
