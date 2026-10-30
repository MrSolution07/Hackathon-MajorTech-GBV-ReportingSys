import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { BrandMark } from "@/src/components/chrome";
import { Screen, T } from "@/src/components/primitives";
import { useSession } from "@/src/data/session";
import { space } from "@/src/theme/tokens";

export default function Gate() {
  const { ready, user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    router.replace(user ? "/(tabs)" : "/welcome");
  }, [ready, user, router]);

  return (
    <Screen exit={false}>
      <View style={{ flex: 1, justifyContent: "center", gap: space[3], minHeight: 420 }}>
        <BrandMark />
        <T variant="splash" accessibilityRole="header">
          SafeStep
        </T>
        <T variant="body">The file still exists on Monday.</T>
      </View>
    </Screen>
  );
}
