import { Tabs } from "expo-router";
import { AppTabBar } from "@/src/components/chrome";

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <AppTabBar state={props.state} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="map" options={{ title: "Map" }} />
      <Tabs.Screen name="reports" options={{ title: "Records" }} />
      <Tabs.Screen name="bell" options={{ title: "Alerts" }} />
      <Tabs.Screen name="profile" options={{ href: null, title: "Profile" }} />
    </Tabs>
  );
}
