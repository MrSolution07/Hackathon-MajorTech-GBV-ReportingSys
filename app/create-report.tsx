import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { Glass } from "@/src/components/Glass";
import { Header } from "@/src/components/chrome";
import { Button, ErrorSummary, Field, PressableScale, Screen, T } from "@/src/components/primitives";
import { errorText } from "@/src/data/errors";
import { pingReminder } from "@/src/data/notify";
import { useRecords } from "@/src/data/records";
import { readSignals } from "@/src/data/signals";
import { incidentTypes, type IncidentType, type SignalResult } from "@/src/data/types";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

const platforms = ["WhatsApp", "Instagram", "Facebook", "SMS", "Email"];

function nowLabel() {
  return new Date().toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" });
}

export default function CreateReport() {
  const router = useRouter();
  const { colors } = useApp();
  const { saveIncident, addPhoto } = useRecords();
  const [type, setType] = useState<IncidentType | "">("");
  const [platform, setPlatform] = useState("");
  const [occurredAt, setOccurredAt] = useState(nowLabel);
  const [summary, setSummary] = useState("");
  const [message, setMessage] = useState("");
  const [signal, setSignal] = useState<SignalResult | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);

  const check = async () => {
    if (!message.trim()) {
      setErrors(["Paste the message first."]);
      return;
    }
    setErrors([]);
    setChecking(true);
    try {
      setSignal(await readSignals(message.trim()));
    } catch (error) {
      setErrors([errorText(error)]);
    } finally {
      setChecking(false);
    }
  };

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.7 });
    if (!result.canceled && result.assets[0]) setPhoto(result.assets[0].uri);
  };

  const save = async () => {
    const next: string[] = [];
    if (!type) next.push("Choose what happened.");
    if (!platform.trim()) next.push("Name the platform.");
    if (!summary.trim()) next.push("Write what happened.");
    setErrors(next);
    if (next.length || !type) return;
    setSaving(true);
    try {
      const id = await saveIncident({
        type,
        platform,
        occurredAt,
        summary,
        message,
        signal,
      });
      if (photo) {
        try {
          await addPhoto(id, photo);
        } catch {
          setErrors(["The record is saved. The photo did not upload."]);
          setSaving(false);
          router.replace(`/incident/${id}`);
          return;
        }
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await pingReminder();
      router.replace(`/incident/${id}`);
    } catch (error) {
      setErrors([errorText(error)]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen footer={<Button label={saving ? "Saving" : "Save incident"} disabled={saving} onPress={save} />}>
      <Header title="New incident" />
      <ErrorSummary items={errors} />
      <T variant="label" style={{ marginTop: space[3] }}>
        What happened?
      </T>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2], marginTop: space[2] }}>
        {incidentTypes.map((item) => {
          const selected = type === item.id;
          return (
            <PressableScale
              key={item.id}
              quiet
              accessibilityLabel={item.label}
              accessibilityState={{ selected }}
              onPress={() => setType(item.id)}
              style={{
                minHeight: 44,
                paddingHorizontal: space[3],
                borderRadius: 18,
                borderWidth: 1,
                borderColor: selected ? colors.accent : colors.fieldBorder,
                backgroundColor: selected ? colors.successBg : colors.input,
                justifyContent: "center",
              }}
            >
              <T variant="label">{item.label}</T>
            </PressableScale>
          );
        })}
      </View>
      <View style={{ gap: space[4], marginTop: space[4] }}>
        <Field label="Platform" value={platform} onChangeText={setPlatform} placeholder="Where it happened" />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
          {platforms.map((item) => (
            <PressableScale key={item} quiet accessibilityLabel={item} onPress={() => setPlatform(item)} style={{ minHeight: 36, justifyContent: "center" }}>
              <T variant="caption" color={colors.accent}>
                {item}
              </T>
            </PressableScale>
          ))}
        </View>
        <Field label="When" value={occurredAt} onChangeText={setOccurredAt} />
        <Field label="What happened" value={summary} onChangeText={setSummary} multiline placeholder="In your words" />
        <Field label="Pasted message" value={message} onChangeText={setMessage} multiline placeholder="The message, as it arrived" />
        <Button variant="outline" label={checking ? "Checking" : "Check message"} disabled={checking} onPress={check} />
        {signal ? (
          <Glass>
            <T variant="label">{signal.signals.length ? signal.signals.join(", ") : "No strong pattern"}</T>
            <T variant="body">{signal.uncertainty}</T>
            <T variant="caption" color={colors.muted}>
              {signal.source === "gemini"
                ? "A model marked these patterns. Not a legal finding."
                : "Checked on this phone."}
            </T>
          </Glass>
        ) : null}
        <T variant="caption" color={colors.muted}>
          Do not add intimate images. For those, use StopNCII.org. A screenshot of a message or a public post is ok.
        </T>
        <Button variant="ghost" label={photo ? "Photo ready" : "Add a screenshot"} onPress={pick} />
      </View>
    </Screen>
  );
}
