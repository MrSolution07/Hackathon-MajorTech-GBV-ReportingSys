import { useState } from "react";
import { Switch, View } from "react-native";
import { useRouter } from "expo-router";
import { Bell, CaretRight, SignOut, Translate, UsersThree } from "phosphor-react-native";
import { ListRow } from "@/src/components/chrome";
import { Screen, T } from "@/src/components/primitives";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function Safety() {
  const router = useRouter();
  const { colors, language } = useApp();
  const [share, setShare] = useState(true);
  const [sos, setSos] = useState(true);
  const trail = <CaretRight size={18} color={colors.muted} />;
  return (
    <Screen tabbed>
      <T variant="h2" color={colors.ink} accessibilityRole="header" style={{ marginBottom: space[3] }}>
        Safety Settings
      </T>
      <ListRow icon={<UsersThree size={22} color={colors.cta} />} title="Emergency Contacts" subtitle="Manage your contacts" trailing={trail} onPress={() => router.push("/info?kind=contacts")} />
      <View style={{ minHeight: 64, flexDirection: "row", alignItems: "center", gap: space[3], borderBottomWidth: 1, borderBottomColor: colors.line }}>
        <T variant="label" style={{ flex: 1 }}>Share My Location</T>
        <Switch accessibilityLabel="Share my location" value={share} onValueChange={setShare} trackColor={{ true: colors.cta, false: colors.line }} />
      </View>
      <T variant="caption" color={colors.muted} style={{ marginBottom: space[2] }}>
        {share ? "On for 1 hour" : "Off"}
      </T>
      <View style={{ minHeight: 64, flexDirection: "row", alignItems: "center", gap: space[3], borderBottomWidth: 1, borderBottomColor: colors.line }}>
        <T variant="label" style={{ flex: 1 }}>SOS Shortcut</T>
        <Switch accessibilityLabel="SOS shortcut" value={sos} onValueChange={setSos} trackColor={{ true: colors.cta, false: colors.line }} />
      </View>
      <T variant="caption" color={colors.muted} style={{ marginBottom: space[2] }}>
        Tap 3 times to alert Namola
      </T>
      <ListRow icon={<Translate size={22} color={colors.cta} />} title="Language" subtitle={language} trailing={trail} onPress={() => router.push("/language")} />
      <ListRow icon={<Bell size={22} color={colors.cta} />} title="Notifications" subtitle="Route alerts, safety updates" trailing={trail} onPress={() => router.push("/info?kind=notifications")} />
      <ListRow icon={<SignOut size={22} color={colors.danger} />} title="Leave quickly" subtitle="Return to the start screen" onPress={() => router.replace("/")} />
    </Screen>
  );
}
