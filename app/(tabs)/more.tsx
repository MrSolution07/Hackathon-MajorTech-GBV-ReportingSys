import { useRouter } from "expo-router";
import { FileText, Info, ShareNetwork, ShieldCheck, Star } from "phosphor-react-native";
import { CaretRight } from "phosphor-react-native";
import { ListRow } from "@/src/components/chrome";
import { Screen, T } from "@/src/components/primitives";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

export default function More() {
  const router = useRouter();
  const { colors } = useApp();
  const trail = <CaretRight size={18} color={colors.muted} />;
  return (
    <Screen tabbed>
      <T variant="h2" color={colors.ink} accessibilityRole="header" style={{ marginBottom: space[2] }}>
        More
      </T>
      <ListRow icon={<ShieldCheck size={22} color={colors.cta} />} title="About SafeStep" subtitle="Safer walks. Stronger women. Version 1.0.0" />
      <ListRow icon={<FileText size={22} color={colors.cta} />} title="Terms & Conditions" trailing={trail} onPress={() => router.push("/info?kind=terms")} />
      <ListRow icon={<Info size={22} color={colors.cta} />} title="Privacy Policy" trailing={trail} onPress={() => router.push("/info?kind=privacy")} />
      <ListRow icon={<Star size={22} color={colors.cta} />} title="Rate Us" trailing={trail} onPress={() => router.push("/info?kind=rate")} />
      <ListRow icon={<ShareNetwork size={22} color={colors.cta} />} title="Share App" trailing={trail} onPress={() => router.push("/info?kind=share")} />
    </Screen>
  );
}
