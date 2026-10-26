import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { AppleLogo, EnvelopeSimple, GoogleLogo, LockSimple } from "phosphor-react-native";
import { BrandMark } from "@/src/components/chrome";
import { Button, ErrorSummary, Field, PressableScale, Screen, T } from "@/src/components/primitives";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function Login() {
  const router = useRouter();
  const { colors } = useApp();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const submit = () => {
    const next: string[] = [];
    if (!id.trim()) next.push("Enter an email or phone number.");
    if (!password) next.push("Enter your password.");
    setErrors(next);
    if (!next.length) router.replace("/(tabs)");
  };

  return (
    <Screen tone="canvas">
      <View style={{ alignItems: "center", gap: space[2], paddingTop: space[6], marginBottom: space[5] }}>
        <BrandMark compact />
        <T variant="title" color={colors.ink} center accessibilityRole="header">
          SafeStep
        </T>
        <T variant="body" color={colors.muted} center>
          Log in to continue
        </T>
      </View>
      <View style={{ gap: space[4] }}>
        <ErrorSummary items={errors} />
        <Field
          label="Email or phone number"
          placeholder="Email or phone number"
          value={id}
          onChangeText={setId}
          autoComplete="username"
          textContentType="username"
          keyboardType="email-address"
          autoCapitalize="none"
          icon={<EnvelopeSimple size={20} color={colors.ink} weight="regular" />}
          error={errors.find((item) => item.includes("email"))}
        />
        <Field
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secure
          autoComplete="current-password"
          textContentType="password"
          icon={<LockSimple size={20} color={colors.ink} weight="regular" />}
          error={errors.find((item) => item.includes("password"))}
        />
        <Button label="Log In" onPress={submit} />
        <PressableScale quiet accessibilityLabel="Forgot password?" onPress={() => router.push("/info?kind=forgot")} style={{ minHeight: 44, justifyContent: "center" }}>
          <T variant="label" color={colors.cta} center>
            Forgot password?
          </T>
        </PressableScale>
        <T variant="caption" color={colors.muted} center>
          or
        </T>
        <Button
          variant="outline"
          label="Continue with Google"
          icon={<GoogleLogo size={20} color={colors.ink} weight="regular" />}
          onPress={() => router.replace("/(tabs)")}
        />
        <Button
          variant="outline"
          label="Continue with Apple"
          icon={<AppleLogo size={20} color={colors.ink} weight="regular" />}
          onPress={() => router.replace("/(tabs)")}
        />
        <PressableScale quiet accessibilityLabel="Sign up" onPress={() => router.push("/signup")} style={{ minHeight: 44, justifyContent: "center" }}>
          <T variant="label" color={colors.muted} center>
            Don’t have an account? <T variant="label" color={colors.cta}>Sign Up</T>
          </T>
        </PressableScale>
      </View>
    </Screen>
  );
}
