import { Linking, View } from "react-native";
import { useRouter } from "expo-router";
import { Glass } from "@/src/components/Glass";
import { Header } from "@/src/components/chrome";
import { Button, PressableScale, Screen, T } from "@/src/components/primitives";
import { incidentLabel } from "@/src/data/types";
import { useRecords } from "@/src/data/records";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function Records() {
  const router = useRouter();
  const { colors } = useApp();
  const { incidents, ready } = useRecords();
  return (
    <Screen tabbed footer={<Button label="New incident" onPress={() => router.push("/create-report")} />}>
      <Header title="Records" back={false} />
      {!ready ? <T variant="caption" color={colors.muted}>Loading records.</T> : null}
      {ready && incidents.length === 0 ? (
        <Glass>
          <T variant="body">No incidents yet. The first one you save stays on this account.</T>
        </Glass>
      ) : null}
      <View style={{ gap: space[3] }}>
        {incidents.map((item) => (
          <PressableScale key={item.id} quiet accessibilityLabel={item.summary} onPress={() => router.push(`/incident/${item.id}`)}>
            <Glass>
              <T variant="label">{incidentLabel(item.type)}</T>
              <T variant="body">{item.summary}</T>
              <T variant="caption" color={colors.muted}>
                {item.status}
              </T>
              <T variant="caption" color={colors.muted}>
                {item.platform}
              </T>
            </Glass>
          </PressableScale>
        ))}
      </View>
      <PressableScale
        quiet
        accessibilityLabel="How StopNCII works"
        onPress={() => Linking.openURL("https://stopncii.org/")}
        style={{ minHeight: 44, justifyContent: "center", marginTop: space[4] }}
      >
        <T variant="caption" color={colors.accent}>
          Intimate images: StopNCII.org, not this app.
        </T>
      </PressableScale>
    </Screen>
  );
}
