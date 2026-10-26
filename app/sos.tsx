import { useRef, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { CheckCircle, Warning } from "phosphor-react-native";
import { Button, PressableScale, Screen, T } from "@/src/components/primitives";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

const HOLD_MS = 3000;

export default function Sos() {
  const router = useRouter();
  const { reduceMotion } = useApp();
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const frame = useRef(0);
  const started = useRef(0);

  const stop = (reset: boolean) => {
    cancelAnimationFrame(frame.current);
    if (reset && !ready) setProgress(0);
  };

  const tick = () => {
    const next = Math.min(1, (Date.now() - started.current) / HOLD_MS);
    setProgress(next);
    if (next >= 1) {
      setReady(true);
      if (!reduceMotion) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
      return;
    }
    frame.current = requestAnimationFrame(tick);
  };

  const begin = () => {
    if (ready) return;
    started.current = Date.now();
    frame.current = requestAnimationFrame(tick);
  };

  const secondsLeft = Math.max(1, Math.ceil((1 - progress) * 3));

  return (
    <Screen
      tone="sos"
      scroll={false}
      footer={<Button variant="inverse" label={ready ? "Close" : "Cancel"} onPress={() => router.back()} />}
    >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: space[5] }}>
        <PressableScale
          quiet={ready}
          accessibilityLabel={ready ? "Preview ready" : "Hold to alert"}
          accessibilityHint="Hold for 3 seconds. This preview does not contact Namola."
          onPressIn={begin}
          onPressOut={() => stop(true)}
          disabled={ready}
          style={{ width: 220, height: 220, alignItems: "center", justifyContent: "center" }}
        >
          <View
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              borderWidth: 8,
              borderColor: "rgba(255,255,255,0.35)",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: ready ? "rgba(255,255,255,0.16)" : "transparent",
            }}
          >
            <View
              style={{
                position: "absolute",
                width: 200,
                height: 200,
                borderRadius: 100,
                borderWidth: 8,
                borderColor: "#FFFFFF",
                opacity: ready ? 1 : progress,
              }}
            />
            {ready ? (
              <CheckCircle size={64} color="#FFFFFF" weight="fill" />
            ) : (
              <Warning size={48} color="#FFFFFF" weight="fill" />
            )}
            <T variant="title" color="#FFFFFF">
              {ready ? "Ready" : "SOS"}
            </T>
          </View>
        </PressableScale>
        <T variant="body" color="#FFFFFF" center>
          {ready
            ? "Preview only. Namola was not contacted."
            : reduceMotion
              ? `Hold steady. ${progress === 0 ? "3" : secondsLeft}`
              : "Hold for 3 seconds to alert Namola"}
        </T>
      </View>
    </Screen>
  );
}
