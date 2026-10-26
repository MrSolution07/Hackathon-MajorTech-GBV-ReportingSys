import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Header } from "@/src/components/chrome";
import { Button, hitSize, PressableScale, Screen, T } from "@/src/components/primitives";
import { languages } from "@/src/data/fixtures";
import { useApp } from "@/src/theme/Theme";
import { radius, space } from "@/src/theme/tokens";

export default function Language() {
  const router = useRouter();
  const { colors, language, setLanguage } = useApp();
  const [picked, setPicked] = useState(language);
  return (
    <Screen footer={<Button label="Save" onPress={() => { setLanguage(picked); router.back(); }} />}>
      <Header title="Language" />
      <T variant="body" color={colors.muted} style={{ marginBottom: space[3] }}>
        Choose your language
      </T>
      <View style={{ gap: space[2] }}>
        {languages.map((item) => {
          const selected = picked === item;
          return (
            <PressableScale
              key={item}
              quiet
              accessibilityLabel={item}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setPicked(item)}
              style={{
                minHeight: hitSize,
                borderRadius: radius.input,
                borderWidth: 1.5,
                borderColor: selected ? colors.cta : colors.fieldBorder,
                backgroundColor: selected ? colors.chip : colors.card,
                paddingHorizontal: space[4],
                flexDirection: "row",
                alignItems: "center",
                gap: space[3],
              }}
            >
              <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.cta, alignItems: "center", justifyContent: "center" }}>
                {selected ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.cta }} /> : null}
              </View>
              <T variant="body" color={colors.text} style={{ flex: 1 }}>
                {item}
              </T>
            </PressableScale>
          );
        })}
      </View>
    </Screen>
  );
}
