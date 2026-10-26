import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import { Avatar, Card, Header } from "@/src/components/chrome";
import { MapArt } from "@/src/components/MapArt";
import { Screen, T } from "@/src/components/primitives";
import { matches, type MatchId } from "@/src/data/fixtures";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function WalkMap() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const person = matches[(id as MatchId) || "thandi"] ?? matches.thandi;
  const { colors } = useApp();
  const router = useRouter();
  return (
    <Screen tabbed padded={false} scroll={false}>
      <View style={{ paddingHorizontal: space[5], paddingTop: space[2] }}>
        <Header title="Walk Together" />
      </View>
      <View style={{ flex: 1, paddingHorizontal: space[5] }}>
        <MapArt height={520} />
        <Card style={{ position: "absolute", left: space[5], right: space[5], bottom: space[4] }}>
          <View style={{ flexDirection: "row", gap: space[3], alignItems: "center" }}>
            <Avatar initials={person.name.slice(0, 1)} />
            <View style={{ flex: 1 }}>
              <T variant="label" color={colors.ink}>2 women heading your way</T>
              <T variant="caption" color={colors.muted}>{person.meetShort}</T>
            </View>
          </View>
          <T
            variant="label"
            color={colors.cta}
            onPress={() => router.push({ pathname: "/match", params: { id: person.id } })}
            accessibilityRole="link"
          >
            View {person.name}
          </T>
        </Card>
      </View>
    </Screen>
  );
}
