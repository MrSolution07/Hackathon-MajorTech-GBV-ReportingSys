import { useState } from "react";
import { View } from "react-native";
import { Bus, Taxi, Train } from "phosphor-react-native";
import { Chip, Empty, Header, ListRow } from "@/src/components/chrome";
import { Screen, T } from "@/src/components/primitives";
import { bookings } from "@/src/data/fixtures";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function Bookings() {
  const { colors } = useApp();
  const [tab, setTab] = useState<"Upcoming" | "Past">("Upcoming");
  const icons = [Train, Taxi, Bus];
  return (
    <Screen tabbed>
      <Header title="My Bookings" />
      <View style={{ flexDirection: "row", gap: space[2], marginBottom: space[4] }}>
        <Chip label="Upcoming" selected={tab === "Upcoming"} onPress={() => setTab("Upcoming")} />
        <Chip label="Past" selected={tab === "Past"} onPress={() => setTab("Past")} />
      </View>
      {tab === "Past" ? <Empty title="No past bookings yet." /> : null}
      {tab === "Upcoming"
        ? bookings.map((item, index) => {
            const Icon = icons[index] ?? Taxi;
            return (
              <ListRow
                key={item.id}
                icon={<Icon size={22} color={colors.cta} />}
                title={item.title}
                subtitle={item.when}
                trailing={
                <T variant="caption" color={colors.success}>
                  {item.status}
                </T>
              }
              />
            );
          })
        : null}
    </Screen>
  );
}

