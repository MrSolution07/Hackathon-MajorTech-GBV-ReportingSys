import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useApp } from "@/src/theme/Theme";

export function Wash() {
  const { colors, reduceMotion } = useApp();
  const drift = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      drift.value = 0;
      return;
    }
    drift.value = withRepeat(
      withTiming(1, { duration: 28000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [drift, reduceMotion]);

  const sun = useAnimatedStyle(() => ({
    transform: [{ translateX: -30 + drift.value * 70 }, { translateY: drift.value * 36 }],
  }));
  const leaf = useAnimatedStyle(() => ({
    transform: [{ translateX: 20 - drift.value * 50 }, { translateY: -20 + drift.value * 24 }],
  }));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.blob, styles.sun, { backgroundColor: colors.sun }, sun]} />
      <Animated.View style={[styles.blob, styles.leaf, { backgroundColor: colors.leaf }, leaf]} />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.45,
  },
  sun: { width: 420, height: 260, top: 40, right: -160, transform: [{ rotate: "-18deg" }] },
  leaf: { width: 280, height: 180, bottom: -40, left: -80 },
});
