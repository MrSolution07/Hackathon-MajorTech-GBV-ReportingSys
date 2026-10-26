import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Clock, MapPin, RoadHorizon } from "phosphor-react-native";
import { Avatar, Header, ListRow } from "@/src/components/chrome";
import { Button, Screen, T } from "@/src/components/primitives";
import { matches, type MatchId } from "@/src/data/fixtures";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function MatchDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const person = matches[(id as MatchId) || "thandi"] ?? matches.thandi;
  const router = useRouter();
  const { colors } = useApp();
  return (
    <Screen
      footer={
        <View style={{ gap: space[3] }}>
          <Button label="Message" onPress={() => router.push("/info?kind=help")} />
          <Button variant="danger" label="Cancel" onPress={() => router.back()} />
        </View>
      }
    >
      <Header title="Match Details" />
      <View style={{ alignItems: "center", gap: space[2], marginBottom: space[4] }}>
        <Avatar initials={person.name.slice(0, 1)} size={72} />
        <T variant="h2" color={colors.ink}>{person.name}</T>
        <T variant="body" color={colors.muted}>{person.dest}</T>
      </View>
      <ListRow icon={<Clock size={22} color={colors.cta} />} title={`${person.detailLeaves} • ${person.away}`} />
      <ListRow icon={<RoadHorizon size={22} color={colors.cta} />} title={person.share} />
      <ListRow icon={<MapPin size={22} color={colors.cta} />} title={person.meet} />
    </Screen>
  );
}
