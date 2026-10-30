import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { useApp } from "@/src/theme/Theme";

function useFlow(ms: number, reduce: boolean) {
  const value = useSharedValue(0);
  useEffect(() => {
    if (reduce) {
      value.value = 0;
      return;
    }
    value.value = withRepeat(withTiming(1, { duration: ms, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [ms, reduce, value]);
  return value;
}

function shift(value: SharedValue<number>, x: number, y: number) {
  return useAnimatedStyle(() => ({
    transform: [
      { translateX: value.value * x },
      { translateY: value.value * y },
      { scale: 1 + value.value * 0.18 },
    ],
  }));
}

export function Wash() {
  const { reduceMotion } = useApp();
  const a = useFlow(18000, reduceMotion);
  const b = useFlow(24000, reduceMotion);
  const c = useFlow(20000, reduceMotion);
  const moveA = shift(a, 140, 90);
  const moveB = shift(b, -160, 70);
  const moveC = shift(c, 80, -110);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.blob, styles.teal, moveA]} />
      <Animated.View style={[styles.blob, styles.brass, moveB]} />
      <Animated.View style={[styles.blob, styles.deep, moveC]} />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: { position: "absolute", borderRadius: 999, opacity: 0.55 },
  teal: { width: 340, height: 340, backgroundColor: "#1f6f62", top: -80, left: -60 },
  brass: { width: 300, height: 420, backgroundColor: "#8a5a32", top: 80, right: -100 },
  deep: { width: 280, height: 280, backgroundColor: "#16382f", bottom: -80, left: 40 },
});
