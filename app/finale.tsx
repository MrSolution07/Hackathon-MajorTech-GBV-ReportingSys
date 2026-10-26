import { View } from "react-native";
import { useRouter } from "expo-router";
import { BrandMark } from "@/src/components/chrome";
import { Button, Screen, T } from "@/src/components/primitives";
import { space } from "@/src/theme/tokens";

export default function Finale() {
  const router = useRouter();
  return (
    <Screen
      tone="brand"
      footer={<Button variant="inverse" label="Get Started" onPress={() => router.replace("/login")} />}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: space[4], minHeight: 420 }}>
        <BrandMark light />
        <T variant="splash" color="#FFFFFF" center style={{ fontSize: 40, lineHeight: 46 }} accessibilityRole="header">
          SafeStep
        </T>
        <T variant="title" color="#FFFFFF" center>
          Together we go further.
        </T>
        <T variant="body" color="#FFFFFF" center>
          Safer streets. Brighter futures.
        </T>
      </View>
    </Screen>
  );
}
