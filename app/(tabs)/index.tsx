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
      ) : incidents.length ? (
        <View style={{ gap: space[3] }}>
          <T variant="caption" color={colors.muted}>
            Sample file. Not a real person. The pattern is real: threats, image abuse, stalking, and posts of private details.
          </T>
          {incidents.slice(0, 4).map((item) => (
            <PressableScale key={item.id} quiet accessibilityLabel={item.summary} onPress={() => router.push(`/incident/${item.id}`)}>
              <Glass>
                <T variant="h2">{incidentLabel(item.type)}</T>
                <T variant="body">{item.summary}</T>
                <T variant="caption" color={colors.muted}>{item.platform}</T>
                <T variant="caption" color={colors.muted}>{item.occurredAt}</T>
                <T variant="caption" color={colors.accent}>{item.status}</T>
              </Glass>
            </PressableScale>
          ))}
        </View>
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
