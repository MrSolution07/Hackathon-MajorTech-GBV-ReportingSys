import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Bus, Taxi, Train } from "phosphor-react-native";
import { Chip, Header, ListRow } from "@/src/components/chrome";
import { Button, Screen, T } from "@/src/components/primitives";
import { transports } from "@/src/data/fixtures";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

const filters = [
  { id: "taxi", label: "Taxi", icon: Taxi },
  { id: "bus", label: "Bus", icon: Bus },
  { id: "train", label: "Train", icon: Train },
] as const;

export default function Transport() {
  const router = useRouter();
  const { colors } = useApp();
  const [mode, setMode] = useState<(typeof filters)[number]["id"]>("taxi");
  const rows = transports.filter((item) => (mode === "train" ? item.id === "train" : mode === "bus" ? item.id === "bus" : item.id === "taxi"));
  return (
    <Screen footer={<Button label="Choose Transport" onPress={() => router.back()} />}>
      <Header title="Transport Options" />
      <View style={{ flexDirection: "row", gap: space[2], marginBottom: space[4] }}>
        {filters.map((item) => (
          <Chip key={item.id} label={item.label} selected={mode === item.id} onPress={() => setMode(item.id)} />
        ))}
      </View>
      <T variant="label" color={colors.ink} style={{ marginBottom: space[2] }}>
        Nearby options
      </T>
      {(rows.length ? rows : transports).map((item) => {
        const Icon = item.id === "train" ? Train : item.id === "bus" ? Bus : Taxi;
        return (
          <ListRow
            key={item.id}
            icon={<Icon size={22} color={colors.cta} />}
            title={item.title}
            subtitle={item.meta}
            trailing={<T variant="label" color={colors.cta}>View</T>}
            onPress={() => router.back()}
          />
        );
      })}
    </Screen>
  );
}
