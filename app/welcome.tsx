import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button, ErrorSummary, PressableScale, Screen, T } from "@/src/components/primitives";
import { errorText } from "@/src/data/errors";
import { useSession } from "@/src/data/session";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function Welcome() {
  const router = useRouter();
  const { colors } = useApp();
  const { signInDemo } = useSession();
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const openDemo = async () => {
    setErrors([]);
    setBusy(true);
    try {
      await signInDemo();
      router.replace("/(tabs)");
    } catch (error) {
      setErrors([errorText(error)]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen
      exit={false}
      footer={
        <View style={{ gap: space[2] }}>
          <Button label={busy ? "Opening" : "Open demo"} disabled={busy} onPress={openDemo} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <PressableScale quiet accessibilityLabel="Log in" onPress={() => router.push("/login")} style={{ minHeight: 44, justifyContent: "center" }}>
              <T variant="label" color={colors.accent}>Log in</T>
            </PressableScale>
            <PressableScale quiet accessibilityLabel="Create account" onPress={() => router.push("/signup")} style={{ minHeight: 44, justifyContent: "center" }}>
              <T variant="label" color={colors.ink}>Create account</T>
            </PressableScale>
          </View>
        </View>
      }
    >
      <View style={{ gap: space[4], paddingTop: space[10], paddingBottom: space[6] }}>
        <T variant="label" color={colors.muted} center>South Africa</T>
        <T variant="title" center accessibilityRole="header">
          The file still exists on Monday.
        </T>
        <T variant="body" color={colors.muted} center>
          Save what happened. See the pattern. Choose the next step. Nothing is sent unless you send it.
        </T>
        <ErrorSummary items={errors} />
      </View>
    </Screen>
  );
}
