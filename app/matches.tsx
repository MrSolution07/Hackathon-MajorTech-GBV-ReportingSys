import { View } from "react-native";
import { useRouter } from "expo-router";
import { Avatar, Header, ListRow } from "@/src/components/chrome";
import { Button, Screen, T } from "@/src/components/primitives";
import { matches } from "@/src/data/fixtures";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function Matches() {
  const router = useRouter();
  const { colors } = useApp();
  const people = [matches.thandi, matches.zanele];
  return (
    <Screen footer={<Button variant="outline" label="Refresh" onPress={() => undefined} />}>
      <Header title="Matching Results" />
      <T variant="body" color={colors.muted} style={{ marginBottom: space[3] }}>
        2 matches found
      </T>
      {people.map((person) => (
        <ListRow
          key={person.id}
          icon={<Avatar initials={person.name.slice(0, 1)} size={40} />}
          title={person.name}
          subtitle={`${person.dest}\n${person.leaves}`}
          onPress={() => router.push({ pathname: "/match", params: { id: person.id } })}
          trailing={
            <View>
              <T variant="label" color={colors.cta}>View</T>
            </View>
          }
        />
      ))}
    </Screen>
  );
}
