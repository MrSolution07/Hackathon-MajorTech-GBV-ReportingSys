import { Platform } from "react-native";

export async function pingReminder() {
  if (Platform.OS === "web") return;
  try {
    const Notifications = await import("expo-notifications");
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("reminders", {
        name: "Reminders",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    const permission = await Notifications.getPermissionsAsync();
    const next =
      permission.status === "granted" ? permission : await Notifications.requestPermissionsAsync();
    if (next.status !== "granted") return;
    await Notifications.scheduleNotificationAsync({
      content: { title: "Reminder", body: "You have an update.", sound: false },
      trigger: null,
    });
  } catch {
    // The in-app alert is the record that matters. A missing lock-screen ping does not fail the save.
  }
}
