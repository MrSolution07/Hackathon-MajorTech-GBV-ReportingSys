import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { CheckCircle, Flag, Lightbulb, Warning } from "phosphor-react-native";
import { Chip, Empty } from "@/src/components/chrome";
import { ListRow } from "@/src/components/chrome";
import { PressableScale, Screen, T } from "@/src/components/primitives";
import { reports } from "@/src/data/fixtures";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

const filters = ["All", "Resolved", "In Progress"] as const;

function iconFor(type: string, color: string) {
  if (type === "Unsafe Spot") return <Warning size={22} color={color} />;
  if (type === "Broken Streetlight") return <Lightbulb size={22} color={color} />;
  return <Flag size={22} color={color} />;
}

export default function Reports() {
  const router = useRouter();
  const { colors } = useApp();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const rows = reports.filter((item) => (filter === "All" ? true : item.status === filter));

  return (
    <Screen tabbed>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space[4] }}>
        <T variant="h2" color={colors.ink} accessibilityRole="header">My Reports</T>
        <PressableScale quiet accessibilityLabel="New report" onPress={() => router.push("/create-report")} style={{ minHeight: 44, justifyContent: "center", paddingHorizontal: space[2] }}>
          <T variant="label" color={colors.cta}>New report</T>
        </PressableScale>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2], marginBottom: space[4] }}>
        {filters.map((item) => (
          <Chip key={item} label={item} selected={filter === item} onPress={() => setFilter(item)} />
        ))}
      </View>
      {rows.length === 0 ? <Empty title="No reports in this filter." /> : null}
      {rows.map((item) => (
        <ListRow
          key={item.id}
          icon={iconFor(item.type, colors.cta)}
          title={item.type}
          subtitle={item.when}
          trailing={
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, maxWidth: 110 }}>
              {item.status === "Resolved" ? (
                <CheckCircle size={16} color={colors.success} weight="fill" />
              ) : (
                <Warning size={16} color={colors.cta} weight="fill" />
              )}
              <T variant="caption" color={item.status === "Resolved" ? colors.success : colors.cta}>
                {item.status}
              </T>
            </View>
          }
        />
      ))}
    </Screen>
  );
}
