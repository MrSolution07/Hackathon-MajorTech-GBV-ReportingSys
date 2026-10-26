import { View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { useApp } from "@/src/theme/Theme";

export function MapArt({ height = 280 }: { height?: number }) {
  const { colors } = useApp();
  return (
    <View
      accessible
      accessibilityLabel="Map showing a safe route, 12 minutes, 3.2 kilometres, low risk."
      style={{ height, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: colors.imageOutline }}
    >
      <Svg width="100%" height="100%" viewBox="0 0 360 280">
        <Rect width="360" height="280" fill={colors.map} />
        <Rect x="18" y="24" width="90" height="54" rx="8" fill={colors.park} />
        <Rect x="250" y="36" width="86" height="70" rx="8" fill={colors.park} />
        <Rect x="40" y="180" width="70" height="60" rx="8" fill={colors.park} />
        <Path d="M0 90 H360 M0 170 H360 M80 0 V280 M190 0 V280 M280 0 V280" stroke={colors.road} strokeWidth="16" />
        <Path
          d="M70 230 C 110 200, 140 190, 170 150 S 230 90, 290 60"
          stroke={colors.cta}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx="70" cy="230" r="9" fill={colors.pin} />
        <Circle cx="190" cy="128" r="8" fill={colors.pinHot} />
        <Circle cx="290" cy="60" r="9" fill={colors.cta} />
      </Svg>
    </View>
  );
}
