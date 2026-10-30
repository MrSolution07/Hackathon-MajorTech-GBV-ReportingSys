import { Linking, View } from "react-native";
import { Glass } from "@/src/components/Glass";
import { SupportMap } from "@/src/components/SupportMap";
import { Header } from "@/src/components/chrome";
import { PressableScale, Screen, T } from "@/src/components/primitives";
import { lines, places } from "@/src/data/helplines";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function MapScreen() {
  const { colors } = useApp();
  return (
    <Screen tabbed padded={false}>
      <View style={{ paddingHorizontal: space[5], paddingTop: space[2] }}>
        <Header title="Support" back={false} />
        <T variant="body" color={colors.muted}>
          Two offices with a published address. National lines stay as calls, not pins.
        </T>
      </View>
      <View style={{ padding: space[5], gap: space[3] }}>
        <SupportMap pins={places} height={320} />
        {places.map((place) => (
          <Glass key={place.id}>
            <T variant="label">{place.name}</T>
            <T variant="body">{place.detail}</T>
            <PressableScale quiet accessibilityLabel={`Call ${place.name}`} onPress={() => Linking.openURL(place.tel)} style={{ minHeight: 44, justifyContent: "center" }}>
              <T variant="label" color={colors.accent}>
                {place.phone}
              </T>
            </PressableScale>
            <PressableScale quiet accessibilityLabel={place.sourceLabel} onPress={() => Linking.openURL(place.source)} style={{ minHeight: 44, justifyContent: "center" }}>
              <T variant="caption" color={colors.muted}>
                {place.sourceLabel}
              </T>
            </PressableScale>
          </Glass>
        ))}
        <Glass>
          <T variant="label">National lines</T>
          {lines.map((line) => (
            <PressableScale key={line.number} quiet accessibilityLabel={`${line.name} ${line.number}`} onPress={() => Linking.openURL(line.href)} style={{ minHeight: 48, justifyContent: "center" }}>
              <T variant="body">
                {line.name} {line.number}
              </T>
            </PressableScale>
          ))}
        </Glass>
      </View>
    </Screen>
  );
}
