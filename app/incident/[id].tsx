import { useEffect, useState } from "react";
import { Linking, Platform, Share, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Glass } from "@/src/components/Glass";
import { Header } from "@/src/components/chrome";
import { Button, ErrorSummary, PressableScale, Screen, T } from "@/src/components/primitives";
import { lines, STOP_NCII } from "@/src/data/helplines";
import { errorText } from "@/src/data/errors";
import { useRecords } from "@/src/data/records";
import { incidentLabel, type Entry, type IncidentStatus } from "@/src/data/types";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

const statuses: { id: IncidentStatus; label: string }[] = [
  { id: "saved", label: "Saved" },
  { id: "prepared", label: "Prepared" },
  { id: "shared", label: "Shared" },
];

function recordText(summary: string, platform: string, when: string, entries: Entry[]) {
  const linesOfText = [
    "SafeStep record",
    summary,
    platform,
    when,
    "",
    ...entries.map((entry) => {
      if (entry.kind === "signal") return `Signal: ${entry.body}`;
      if (entry.kind === "file") return "File: a screenshot is stored on the account.";
      return `Words: ${entry.body}`;
    }),
    "",
    "This is not a legal finding. Nothing was sent until you shared it.",
  ];
  return linesOfText.join("\n");
}

export default function IncidentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useApp();
  const { incidents, ready, entriesFor, setStatus, addPhoto } = useRecords();
  const incident = incidents.find((item) => item.id === id);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!id) return;
    entriesFor(String(id))
      .then(setEntries)
      .catch(() => setEntries([]));
  }, [id, incidents, entriesFor]);

  const share = async () => {
    if (!incident) return;
    const text = recordText(incident.summary, incident.platform, incident.occurredAt, entries);
    try {
      if (Platform.OS === "web" && typeof navigator !== "undefined") {
        const nav = navigator as Navigator & { share?: (data: { text: string }) => Promise<void> };
        if (nav.share) await nav.share({ text });
        else {
          await navigator.clipboard.writeText(text);
          setNote("Copied the record.");
        }
        return;
      }
      await Share.share({ message: text });
    } catch (error) {
      setErrors([errorText(error)]);
    }
  };

  const pick = async () => {
    if (!incident) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.7 });
    if (result.canceled || !result.assets[0]) return;
    try {
      await addPhoto(incident.id, result.assets[0].uri);
      setEntries(await entriesFor(incident.id));
    } catch (error) {
      setErrors([errorText(error)]);
    }
  };

  if (!incident) {
    return (
      <Screen>
        <Header title="Incident" />
        <T variant="body">{ready ? "That record is not on this account." : "Loading the record."}</T>
      </Screen>
    );
  }

  const command = lines[0];

  return (
    <Screen>
      <Header title={incidentLabel(incident.type)} />
      <ErrorSummary items={errors} />
      {incident.sample ? (
        <T variant="caption" color={colors.muted} style={{ marginBottom: space[3] }}>
          Sample. Not a real person.
        </T>
      ) : null}
      <T variant="h2">{incident.summary}</T>
      <T variant="caption" color={colors.muted}>
        {incident.platform}
      </T>
      <T variant="caption" color={colors.muted}>
        {incident.occurredAt}
      </T>
      <View style={{ flexDirection: "row", gap: space[2], marginTop: space[4], flexWrap: "wrap" }}>
        {statuses.map((item) => (
          <PressableScale
            key={item.id}
            quiet
            accessibilityLabel={item.label}
            accessibilityState={{ selected: incident.status === item.id }}
            onPress={() => setStatus(incident, item.id).catch((error) => setErrors([errorText(error)]))}
            style={{
              minHeight: 44,
              paddingHorizontal: space[3],
              borderRadius: 18,
              borderWidth: 1,
              justifyContent: "center",
              borderColor: incident.status === item.id ? colors.accent : colors.fieldBorder,
              backgroundColor: incident.status === item.id ? colors.successBg : colors.input,
            }}
          >
            <T variant="label">{item.label}</T>
          </PressableScale>
        ))}
      </View>
      <T variant="label" style={{ marginTop: space[5] }}>
        Timeline
      </T>
      <View style={{ gap: space[3], marginTop: space[2] }}>
        {entries.map((entry) => (
          <Glass key={entry.id}>
            <T variant="caption" color={colors.muted}>
              {entry.kind === "signal" ? "Signal" : entry.kind === "file" ? "File" : "Her words"}
            </T>
            {entry.kind === "file" ? (
              <PressableScale quiet accessibilityLabel="Open screenshot" onPress={() => Linking.openURL(entry.body)}>
                <T variant="body" color={colors.accent}>
                  Open the screenshot
                </T>
              </PressableScale>
            ) : (
              <T variant="body">{entry.body}</T>
            )}
          </Glass>
        ))}
      </View>
      <View style={{ gap: space[3], marginTop: space[5] }}>
        <Glass>
          <T variant="label">Next step</T>
          <T variant="body">
            Report it on {incident.platform}. A report there does not remove every copy.
          </T>
          <PressableScale quiet accessibilityLabel={`Call ${command.name}`} onPress={() => Linking.openURL(command.href)} style={{ minHeight: 44, justifyContent: "center" }}>
            <T variant="label" color={colors.danger}>
              {command.name} {command.number}
            </T>
          </PressableScale>
          {incident.type === "image" || incident.type === "deepfake" ? (
            <PressableScale quiet accessibilityLabel="Open StopNCII" onPress={() => Linking.openURL(STOP_NCII)} style={{ minHeight: 44, justifyContent: "center" }}>
              <T variant="caption" color={colors.accent}>
                StopNCII.org hashes an image on the device. This app does not take those images.
              </T>
            </PressableScale>
          ) : null}
          <T variant="caption" color={colors.muted}>
            The Cybercrimes Act and the Protection from Harassment Act may apply. This is not legal advice.
          </T>
        </Glass>
        <T variant="caption" color={colors.muted}>
          Do not add intimate images. A screenshot of a message or a public post is ok.
        </T>
        <Button variant="outline" label="Add a screenshot" onPress={pick} />
        <Button label="Share record" onPress={share} />
        {note ? <T variant="caption">{note}</T> : null}
      </View>
    </Screen>
  );
}
