import { View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight } from "phosphor-react-native";
import { BrandMark } from "@/src/components/chrome";
import { Button, PressableScale, Screen, T } from "@/src/components/primitives";
import { space } from "@/src/theme/tokens";

export default function Splash() {
  const router = useRouter();
  return (
    <Screen
      tone="brand"
      footer={
        <View style={{ gap: space[2] }}>
          <Button
            variant="inverse"
            label="Get Started"
            icon={<ArrowRight size={20} color="#5930C5" weight="bold" />}
            onPress={() => router.push("/welcome")}
          />
          <PressableScale quiet accessibilityLabel="Log in" onPress={() => router.push("/login")} style={{ minHeight: 44, justifyContent: "center" }}>
            <T variant="caption" color="#FFFFFF" center>
              Already have an account? Log In
            </T>
          </PressableScale>
        </View>
      }
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: space[3], minHeight: 420 }}>
        <BrandMark light />
        <T variant="splash" color="#FFFFFF" center accessibilityRole="header">
          SafeStep
        </T>
        <T variant="body" color="#FFFFFF" center>
          Walk your route,{"\n"}not your fear.
        </T>
      </View>
    </Screen>
  );
}
