import { Tabs } from "expo-router";
import { AppTabBar } from "@/src/components/chrome";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar state={props.state} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="map" options={{ title: "Map" }} />
      <Tabs.Screen name="reports" options={{ title: "Reports" }} />
      <Tabs.Screen name="more" options={{ title: "More" }} />
      <Tabs.Screen name="profile" options={{ href: null, title: "Profile" }} />
      <Tabs.Screen name="safety" options={{ href: null, title: "Safety Settings" }} />
      <Tabs.Screen name="bookings" options={{ href: null, title: "My Bookings" }} />
      <Tabs.Screen name="walk-map" options={{ href: null, title: "Walk Together" }} />
    </Tabs>
  );
}
