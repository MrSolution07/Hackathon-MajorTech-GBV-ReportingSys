import { View } from "react-native";
import { useRouter } from "expo-router";
import { CaretRight, Flag, Gear, Question, RoadHorizon, ShieldCheck, UsersThree } from "phosphor-react-native";
import { Avatar, ListRow } from "@/src/components/chrome";
import { Screen, T } from "@/src/components/primitives";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function Profile() {
  const router = useRouter();
  const { colors } = useApp();
  const trail = <CaretRight size={18} color={colors.muted} />;
  return (
    <Screen tabbed>
      <View style={{ alignItems: "center", gap: space[2], marginBottom: space[5], marginTop: space[4] }}>
        <Avatar initials="ND" size={72} />
        <T variant="h2" color={colors.ink} accessibilityRole="header">Nomsa Dlamini</T>
        <T variant="caption" color={colors.muted}>nomsa@email.com</T>
      </View>
      <ListRow icon={<RoadHorizon size={22} color={colors.cta} />} title="My Routes" trailing={trail} onPress={() => router.push("/bookings")} />
      <ListRow icon={<Flag size={22} color={colors.cta} />} title="My Reports" trailing={trail} onPress={() => router.push("/reports")} />
      <ListRow icon={<UsersThree size={22} color={colors.cta} />} title="Walk Together" trailing={trail} onPress={() => router.push("/walk")} />
      <ListRow icon={<ShieldCheck size={22} color={colors.cta} />} title="Safety Settings" trailing={trail} onPress={() => router.push("/safety")} />
      <ListRow icon={<Question size={22} color={colors.cta} />} title="Help & Support" trailing={trail} onPress={() => router.push("/info?kind=help")} />
      <ListRow icon={<Gear size={22} color={colors.cta} />} title="Settings" trailing={trail} onPress={() => router.push("/info?kind=settings")} />
    </Screen>
  );
}
