import { View } from "react-native";
import { useRouter } from "expo-router";
import { Glass } from "@/src/components/Glass";
import { Header } from "@/src/components/chrome";
import { PressableScale, Screen, T } from "@/src/components/primitives";
import { useRecords } from "@/src/data/records";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function Alerts() {
  const router = useRouter();
  const { colors } = useApp();
  const { notices, markRead } = useRecords();
  return (
    <Screen tabbed>
      <Header title="Alerts" back={false} />
      {notices.length === 0 ? (
        <Glass>
          <T variant="body">No alerts yet. Saving an incident adds one here.</T>
        </Glass>
      ) : (
        <View style={{ gap: space[3] }}>
          {notices.map((item) => (
            <PressableScale
              key={item.id}
              quiet
              accessibilityLabel={item.title}
              onPress={() => {
                markRead(item).catch(() => undefined);
                if (item.incidentId) router.push(`/incident/${item.incidentId}`);
              }}
            >
              <Glass>
                <T variant="label">{item.title}</T>
                <T variant="body">{item.body}</T>
                <T variant="caption" color={colors.muted}>
                  {item.read ? "Read" : "New"}
                </T>
              </Glass>
            </PressableScale>
          ))}
        </View>
      )}
    </Screen>
  );
}
