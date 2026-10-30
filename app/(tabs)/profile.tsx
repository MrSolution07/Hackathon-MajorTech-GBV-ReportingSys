import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Header } from "@/src/components/chrome";
import { Button, ErrorSummary, PressableScale, Screen, T } from "@/src/components/primitives";
import { errorText } from "@/src/data/errors";
import { useSession } from "@/src/data/session";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

const schemes = [
  { id: "light" as const, label: "Daylight" },
  { id: "dark" as const, label: "Night" },
  { id: "system" as const, label: "Match device" },
];

export default function Profile() {
  const router = useRouter();
  const { colors, pref, setPref } = useApp();
  const { user, signOut, removeAccount } = useSession();
  const [confirm, setConfirm] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    setBusy(true);
    setErrors([]);
    try {
      await removeAccount();
      router.replace("/welcome");
    } catch (error) {
      setErrors([errorText(error)]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen tabbed>
      <Header title="Profile" back={false} />
      <ErrorSummary items={errors} />
      <T variant="h2">{user?.displayName || "Account"}</T>
      <T variant="caption" color={colors.muted}>
        {user?.email}
      </T>
      <T variant="body" style={{ marginTop: space[4] }}>
        The GBV Command Centre answers in all official languages. This app stays in English.
      </T>
      <T variant="label" style={{ marginTop: space[5] }}>
        Appearance
      </T>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2], marginTop: space[2] }}>
        {schemes.map((item) => (
          <PressableScale
            key={item.id}
            quiet
            accessibilityLabel={item.label}
            accessibilityState={{ selected: pref === item.id }}
            onPress={() => setPref(item.id)}
            style={{
              minHeight: 44,
              paddingHorizontal: space[4],
              borderRadius: 22,
              borderWidth: 1,
              borderColor: pref === item.id ? colors.accent : colors.fieldBorder,
              backgroundColor: pref === item.id ? colors.successBg : colors.input,
              justifyContent: "center",
            }}
          >
            <T variant="label">{item.label}</T>
          </PressableScale>
        ))}
      </View>
      <View style={{ gap: space[3], marginTop: space[6] }}>
        <Button
          variant="outline"
          label="Sign out"
          onPress={async () => {
            await signOut();
            router.replace("/welcome");
          }}
        />
        <Button
          variant="danger"
          label={busy ? "Deleting" : confirm ? "Delete the account and records" : "Delete account"}
          disabled={busy}
          onPress={remove}
        />
      </View>
    </Screen>
  );
}
