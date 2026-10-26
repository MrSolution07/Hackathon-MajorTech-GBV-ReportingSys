import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Camera, CheckCircle, Flag, Lightbulb, Phone, Warning } from "phosphor-react-native";
import { Header } from "@/src/components/chrome";
import { Button, ErrorSummary, Field, PressableScale, Screen, T } from "@/src/components/primitives";
import { incidentTypes } from "@/src/data/fixtures";
import { useApp } from "@/src/theme/Theme";
import { radius, space } from "@/src/theme/tokens";

const icons = {
  harassment: Flag,
  spot: Warning,
  light: Lightbulb,
  other: Phone,
} as const;

export default function CreateReport() {
  const router = useRouter();
  const { colors } = useApp();
  const [type, setType] = useState<string>("");
  const [details, setDetails] = useState("");
  const [photo, setPhoto] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const submit = () => {
    if (!type) {
      setErrors(["Choose an incident type."]);
      return;
    }
    const label = incidentTypes.find((item) => item.id === type)?.label ?? "Report";
    router.replace({ pathname: "/report-submitted", params: { type: label } });
  };

  return (
    <Screen footer={<Button label="Submit Report" onPress={submit} />}>
      <Header title="Create Report" />
      <ErrorSummary items={errors} />
      <T variant="label" color={colors.ink} style={{ marginTop: space[3], marginBottom: space[2] }}>
        What type of incident?
      </T>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
        {incidentTypes.map((item) => {
          const Icon = icons[item.id];
          const selected = type === item.id;
          return (
            <PressableScale
              key={item.id}
              quiet
              accessibilityLabel={item.label}
              accessibilityState={{ selected }}
              onPress={() => {
                setType(item.id);
                setErrors([]);
              }}
              style={{
                width: "48%",
                minHeight: 88,
                borderRadius: radius.card,
                borderWidth: 1.5,
                borderColor: selected ? colors.cta : colors.fieldBorder,
                backgroundColor: selected ? colors.chip : colors.card,
                alignItems: "center",
                justifyContent: "center",
                gap: space[2],
                padding: space[3],
              }}
            >
              <Icon size={24} color={colors.cta} weight={selected ? "fill" : "regular"} />
              <T variant="label" color={colors.ink} center>
                {item.label}
              </T>
            </PressableScale>
          );
        })}
      </View>
      <T variant="label" color={colors.ink} style={{ marginTop: space[5] }}>
        Add a photo (optional)
      </T>
      <PressableScale
        quiet
        accessibilityLabel={photo ? "Photo added" : "Tap to add photo"}
        onPress={() => setPhoto(true)}
        style={{
          marginTop: space[2],
          minHeight: 120,
          borderRadius: radius.card,
          borderWidth: 1.5,
          borderStyle: "dashed",
          borderColor: colors.fieldBorder,
          backgroundColor: colors.card,
          alignItems: "center",
          justifyContent: "center",
          gap: space[2],
        }}
      >
        {photo ? <CheckCircle size={28} color={colors.success} weight="fill" /> : <Camera size={28} color={colors.cta} />}
        <T variant="caption" color={colors.muted}>{photo ? "Photo added" : "Tap to add photo"}</T>
      </PressableScale>
      <View style={{ marginTop: space[4] }}>
        <Field
          label="Additional details"
          placeholder="Tell us what happened..."
          value={details}
          onChangeText={setDetails}
          multiline
          style={{ minHeight: 100, textAlignVertical: "top" }}
        />
      </View>
    </Screen>
  );
}
