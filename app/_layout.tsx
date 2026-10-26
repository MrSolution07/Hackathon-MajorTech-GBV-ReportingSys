import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { AppProvider, useApp } from "@/src/theme/Theme";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function RootStack() {
  const { reduceMotion } = useApp();
  return (
    <Stack screenOptions={{ headerShown: false, animation: reduceMotion ? "none" : "default" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="finale" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="sos" options={{ presentation: "fullScreenModal", animation: reduceMotion ? "none" : "fade" }} />
      <Stack.Screen name="info" options={{ presentation: "modal" }} />
      <Stack.Screen name="route" />
      <Stack.Screen name="navigate" />
      <Stack.Screen name="create-report" />
      <Stack.Screen name="report-submitted" />
      <Stack.Screen name="walk" />
      <Stack.Screen name="matches" />
      <Stack.Screen name="match" />
      <Stack.Screen name="transport" />
      <Stack.Screen name="language" />
    </Stack>
  );
}

export default function RootLayout() {
  const [ready] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => undefined);
  }, [ready]);

  if (!ready) return <StatusBar style="light" />;

  return (
    <SafeAreaProvider>
      <AppProvider>
        <RootStack />
      </AppProvider>
    </SafeAreaProvider>
  );
}
