import { useState } from "react";
import { Switch, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Header, ListRow } from "@/src/components/chrome";
import { Screen, T } from "@/src/components/primitives";
import { useApp, type SchemePref } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

const copy: Record<string, { title: string; body: string }> = {
  forgot: {
    title: "Reset password",
    body: "This preview does not send a reset link. In the full app, a link would go to the email or phone you entered.",
  },
  help: {
    title: "Help & Support",
    body: "SafeStep is a walking-safety preview. For a real emergency, use local emergency services. This demo does not contact responders.",
  },
  terms: {
    title: "Terms & Conditions",
    body: "SafeStep helps people compare routes and share safety notes. This build is a design preview with no accounts and no live reports.",
  },
  privacy: {
    title: "Privacy Policy",
    body: "Nothing you type is uploaded. Language, theme, and form text stay on this device for the session only.",
  },
  rate: {
    title: "Rate SafeStep",
    body: "Store reviews are not available in this preview.",
  },
  share: {
    title: "Share SafeStep",
    body: "Sharing is not connected in this preview. You can still show the app on this device.",
  },
};

export default function Info() {
  const { kind } = useLocalSearchParams<{ kind?: string }>();
  const key = kind ?? "help";
  const { colors, pref, setPref } = useApp();
  const [routeAlerts, setRouteAlerts] = useState(true);
  const [safetyUpdates, setSafetyUpdates] = useState(true);

  if (key === "contacts") {
    return (
      <Screen>
        <Header title="Emergency contacts" />
        <T variant="caption" color={colors.muted}>
          Sample contacts only. Nothing is messaged.
        </T>
        <ListRow title="Lerato M." subtitle="Sister • 082 000 0000" />
        <ListRow title="Aisha K." subtitle="Friend • 071 000 0000" />
      </Screen>
    );
  }

  if (key === "notifications") {
    return (
      <Screen>
        <Header title="Notifications" />
        <RowToggle label="Route alerts" value={routeAlerts} onChange={setRouteAlerts} />
        <RowToggle label="Safety updates" value={safetyUpdates} onChange={setSafetyUpdates} />
      </Screen>
    );
  }

  if (key === "settings") {
    const options: SchemePref[] = ["system", "light", "dark"];
    return (
      <Screen>
        <Header title="Settings" />
        <T variant="label" color={colors.ink}>Appearance</T>
        <View style={{ gap: space[2], marginTop: space[3] }}>
          {options.map((option) => (
            <ListRow
              key={option}
              title={option[0].toUpperCase() + option.slice(1)}
              onPress={() => setPref(option)}
              trailing={
                <T variant="caption" color={pref === option ? colors.cta : colors.muted}>
                  {pref === option ? "On" : ""}
                </T>
              }
            />
          ))}
        </View>
      </Screen>
    );
  }

  const page = copy[key] ?? copy.help;
  return (
    <Screen>
      <Header title={page.title} />
      <T variant="body" color={colors.text}>{page.body}</T>
    </Screen>
  );
}

function RowToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  const { colors } = useApp();
  return (
    <View style={{ minHeight: 64, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: colors.line }}>
      <T variant="label">{label}</T>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onChange}
        trackColor={{ true: colors.cta, false: colors.line }}
      />
    </View>
  );
}
