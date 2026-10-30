import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Header } from "@/src/components/chrome";
import { Button, ErrorSummary, Field, PressableScale, Screen, T } from "@/src/components/primitives";
import { errorText } from "@/src/data/errors";
import { useSession } from "@/src/data/session";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function Login() {
  const router = useRouter();
  const { colors } = useApp();
  const { signIn, sendReset } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const next = [];
    if (!email.includes("@")) next.push("Enter an email.");
    if (password.length < 8) next.push("Use at least 8 characters.");
    setErrors(next);
    setNote("");
    if (next.length) return;
    setBusy(true);
    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch (error) {
      setErrors([errorText(error)]);
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!email.includes("@")) {
      setErrors(["Enter the email first."]);
      return;
    }
    setBusy(true);
    setErrors([]);
    try {
      await sendReset(email);
      setNote("If that account exists, a reset link is on its way.");
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
      if (code === "auth/user-not-found") setNote("If that account exists, a reset link is on its way.");
      else setErrors([errorText(error)]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen exit={false} footer={<Button label={busy ? "Checking" : "Log in"} disabled={busy} onPress={submit} />}>
      <Header title="Log in" />
      <ErrorSummary items={errors} />
      <View style={{ gap: space[4], marginTop: space[4] }}>
        <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <Field label="Password" value={password} onChangeText={setPassword} secure />
        <PressableScale quiet accessibilityLabel="Email a reset link" onPress={reset} style={{ minHeight: 44, justifyContent: "center" }}>
          <T variant="caption" color={colors.accent}>
            Email a reset link
          </T>
        </PressableScale>
        {note ? <T variant="caption">{note}</T> : null}
        <PressableScale quiet accessibilityLabel="Create account" onPress={() => router.push("/signup")} style={{ minHeight: 44, justifyContent: "center" }}>
          <T variant="caption" color={colors.muted}>
            Create account
          </T>
        </PressableScale>
      </View>
    </Screen>
  );
}
