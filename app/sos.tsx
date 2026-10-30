import { Linking, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Header } from "@/src/components/chrome";
import { Glass } from "@/src/components/Glass";
import { PressableScale, Screen, T } from "@/src/components/primitives";
import { lines } from "@/src/data/helplines";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function Sos() {
  const { colors } = useApp();
  return (
    <Screen>
      <Header title="Emergency" />
      <T variant="body" color={colors.muted}>
        These are real numbers. The app does not dispatch anyone.
      </T>
      <View style={{ gap: space[3], marginTop: space[4] }}>
        {lines.map((line) => (
          <PressableScale
            key={line.name}
            quiet
            accessibilityLabel={`${line.name} ${line.number}`}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
              Linking.openURL(line.href);
            }}
          >
            <Glass>
              <T variant="label">{line.name}</T>
              <T variant="h2" color={line.name === "GBV Command Centre" ? colors.danger : colors.ink}>
                {line.number}
              </T>
              <T variant="caption" color={colors.muted}>
                {line.note}
              </T>
            </Glass>
          </PressableScale>
        ))}
      </View>
    </Screen>
  );
}
