import { View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Glass } from "@/src/components/Glass";
import { Avatar } from "@/src/components/chrome";
import { Button, PressableScale, Screen, T } from "@/src/components/primitives";
import { incidentLabel } from "@/src/data/types";
import { useRecords } from "@/src/data/records";
import { useSession } from "@/src/data/session";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function Home() {
  const router = useRouter();
  const { colors } = useApp();
  const { user } = useSession();
  const { incidents, ready } = useRecords();
  const latest = incidents[0];
  const name = user?.displayName || "there";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <Screen
      tabbed
      footer={<Button label="New incident" onPress={() => router.push("/create-report")} />}
    >
      <PressableScale
        quiet
        accessibilityLabel="Open profile"
        onPress={() => router.push("/profile")}
        style={{ flexDirection: "row", alignItems: "center", gap: space[3], minHeight: 44, marginBottom: space[5] }}
      >
        <Avatar initials={initials || "S"} />
        <View>
          <T variant="label">{name}</T>
          <T variant="caption" color={colors.muted}>
            Your records stay on this account.
          </T>
        </View>
      </PressableScale>
      <T variant="title" accessibilityRole="header">
        The file still exists on Monday.
      </T>
      <View style={{ height: space[5] }} />
      {!ready ? (
        <T variant="caption" color={colors.muted}>
          Loading records.
        </T>
      ) : latest ? (
        <PressableScale quiet accessibilityLabel="Open latest incident" onPress={() => router.push(`/incident/${latest.id}`)}>
          <Glass>
            {latest.sample ? (
              <T variant="caption" color={colors.muted}>
                Sample. Not a real person.
              </T>
            ) : null}
            <T variant="h2">{incidentLabel(latest.type)}</T>
            <T variant="body">{latest.summary}</T>
            <T variant="caption" color={colors.muted}>
              {latest.platform}
            </T>
            <T variant="caption" color={colors.muted}>
              {latest.occurredAt}
            </T>
          </Glass>
        </PressableScale>
      ) : (
        <Glass>
          <T variant="body">No incident saved. When you are ready, start a record.</T>
        </Glass>
      )}
      <PressableScale
        quiet
        accessibilityLabel="Emergency numbers"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
          router.push("/sos");
        }}
        style={{ minHeight: 48, justifyContent: "center", marginTop: space[4] }}
      >
        <T variant="label" color={colors.danger}>
          Emergency numbers
        </T>
      </PressableScale>
    </Screen>
  );
}
