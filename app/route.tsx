import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Lightbulb, ShieldCheck, Taxi, UsersThree, Warning } from "phosphor-react-native";
import { Card, Header, ListRow } from "@/src/components/chrome";
import { Button, PressableScale, Screen, T } from "@/src/components/primitives";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

const facts = [
  { title: "Well lit streets", icon: Lightbulb },
  { title: "High foot traffic", icon: UsersThree },
  { title: "Taxi rank nearby", icon: Taxi },
  { title: "No recent incidents", icon: ShieldCheck },
];

export default function RouteDetails() {
  const router = useRouter();
  const { colors } = useApp();
  const [open, setOpen] = useState(false);
  const shown = open ? facts : facts.slice(0, 2);
  return (
    <Screen
      footer={
        <Button label="Start Navigation" onPress={() => router.push("/navigate")} />
      }
    >
      <Header title="Route Details" />
      <Card>
        <View style={{ flexDirection: "row", gap: space[3], alignItems: "center" }}>
          <ShieldCheck size={28} color={colors.cta} weight="duotone" />
          <View>
            <T variant="label" color={colors.ink}>Safe Route</T>
            <T variant="caption" color={colors.muted}>Low risk • 12 min • 3.2 km</T>
          </View>
        </View>
      </Card>
      <View style={{ marginTop: space[4] }}>
        {shown.map((item) => {
          const Icon = item.icon;
          return <ListRow key={item.title} icon={<Icon size={22} color={colors.cta} />} title={item.title} />;
        })}
      </View>
      <PressableScale quiet accessibilityLabel={open ? "Hide details" : "View all details"} onPress={() => setOpen((value) => !value)} style={{ minHeight: 44, justifyContent: "center" }}>
        <T variant="label" color={colors.cta}>{open ? "Hide details" : "View all details"}</T>
      </PressableScale>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[2], marginTop: space[2] }}>
        <Warning size={18} color={colors.muted} />
        <T variant="caption" color={colors.muted}>Risk uses words and icons, not color alone.</T>
      </View>
    </Screen>
  );
}
