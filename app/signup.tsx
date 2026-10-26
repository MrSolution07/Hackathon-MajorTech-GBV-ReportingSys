import { useState } from "react";
import { Modal, View } from "react-native";
import { useRouter } from "expo-router";
import { CaretDown, User } from "phosphor-react-native";
import { Button, ErrorSummary, Field, hitSize, PressableScale, Screen, T } from "@/src/components/primitives";
import { useApp } from "@/src/theme/Theme";
import { radius, space } from "@/src/theme/tokens";

const genders = ["Female", "Male", "Prefer not to say"];

export default function SignUp() {
  const router = useRouter();
  const { colors } = useApp();
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("Female");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const submit = () => {
    const next: string[] = [];
    if (!name.trim()) next.push("Enter your full name.");
    if (!id.trim()) next.push("Enter an email or phone number.");
    if (password.length < 8) next.push("Use at least 8 characters for your password.");
    setErrors(next);
    if (!next.length) router.replace("/(tabs)");
  };

  return (
    <Screen tone="canvas">
      <View style={{ gap: space[2], paddingTop: space[6], marginBottom: space[5] }}>
        <T variant="title" color={colors.ink} accessibilityRole="header">
          Create Your Account
        </T>
        <T variant="body" color={colors.muted}>
          For a safer tomorrow.
        </T>
      </View>
      <View style={{ gap: space[4] }}>
        <ErrorSummary items={errors} />
        <Field label="Full name" placeholder="Full name" value={name} onChangeText={setName} autoComplete="name" textContentType="name" icon={<User size={20} color={colors.ink} />} error={errors.find((item) => item.includes("name"))} />
        <Field label="Email or phone number" placeholder="Email or phone number" value={id} onChangeText={setId} autoComplete="email" keyboardType="email-address" autoCapitalize="none" textContentType="emailAddress" error={errors.find((item) => item.includes("email"))} />
        <Field label="Password" placeholder="Password" value={password} onChangeText={setPassword} secure autoComplete="new-password" textContentType="newPassword" error={errors.find((item) => item.includes("password"))} />
        <View style={{ gap: space[2] }}>
          <T variant="label" color={colors.ink}>
            Gender
          </T>
          <PressableScale
            quiet
            accessibilityLabel={`Gender, ${gender}`}
            accessibilityHint="Opens gender options"
            onPress={() => setOpen(true)}
            style={{ minHeight: 52, borderWidth: 1.5, borderColor: colors.fieldBorder, borderRadius: radius.input, backgroundColor: colors.input, paddingHorizontal: space[4], flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
          >
            <T variant="body" color={colors.text}>{gender}</T>
            <CaretDown size={18} color={colors.ink} />
          </PressableScale>
        </View>
        <Button label="Sign Up" onPress={submit} />
        <PressableScale quiet accessibilityLabel="Log in" onPress={() => router.push("/login")} style={{ minHeight: hitSize, justifyContent: "center" }}>
          <T variant="label" color={colors.muted} center>
            Already have an account? <T variant="label" color={colors.cta}>Log In</T>
          </T>
        </PressableScale>
      </View>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <PressableScale quiet accessibilityLabel="Close gender options" onPress={() => setOpen(false)} style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: colors.card, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, padding: space[5], gap: space[2] }}>
            <T variant="h2" color={colors.ink}>Gender</T>
            {genders.map((option) => (
              <PressableScale
                key={option}
                quiet
                accessibilityLabel={option}
                accessibilityState={{ selected: option === gender }}
                onPress={() => {
                  setGender(option);
                  setOpen(false);
                }}
                style={{ minHeight: hitSize, justifyContent: "center" }}
              >
                <T variant="body" color={option === gender ? colors.cta : colors.text}>{option}</T>
              </PressableScale>
            ))}
          </View>
        </PressableScale>
      </Modal>
    </Screen>
  );
}
