import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Header } from "@/src/components/chrome";
import { Button, ErrorSummary, Field, PressableScale, Screen, T } from "@/src/components/primitives";
import { errorText } from "@/src/data/errors";
import { useSession } from "@/src/data/session";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function Signup() {
  const router = useRouter();
  const { colors } = useApp();
  const { signUp } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const next = [];
    if (name.trim().length < 2) next.push("Enter a name.");
    if (!email.includes("@")) next.push("Enter an email.");
    if (password.length < 8) next.push("Use at least 8 characters.");
    setErrors(next);
    if (next.length) return;
    setBusy(true);
    try {
      await signUp(name, email, password);
      router.replace("/(tabs)");
    } catch (error) {
      setErrors([errorText(error)]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen exit={false} footer={<Button label={busy ? "Creating" : "Create account"} disabled={busy} onPress={submit} />}>
      <Header title="Create account" />
      <ErrorSummary items={errors} />
      <View style={{ gap: space[4], marginTop: space[4] }}>
        <Field label="Name" value={name} onChangeText={setName} autoCapitalize="words" />
        <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <Field label="Password" value={password} onChangeText={setPassword} secure />
        <T variant="caption" color={colors.muted}>
          The account holds your records. You can delete it, and the records, from your profile.
        </T>
        <PressableScale quiet accessibilityLabel="Log in" onPress={() => router.push("/login")} style={{ minHeight: 44, justifyContent: "center" }}>
          <T variant="caption" color={colors.accent}>
            Log in
          </T>
        </PressableScale>
      </View>
    </Screen>
  );
}
