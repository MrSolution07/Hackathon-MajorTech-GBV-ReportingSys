import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from "@expo-google-fonts/bricolage-grotesque";
import { Geist_400Regular, Geist_600SemiBold } from "@expo-google-fonts/geist";
import { RecordsProvider } from "@/src/data/records";
import { SessionProvider } from "@/src/data/session";
import { AppProvider } from "@/src/theme/Theme";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [ready] = useFonts({
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    Geist_400Regular,
    Geist_600SemiBold,
  });

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => undefined);
  }, [ready]);

  if (!ready) return <StatusBar style="light" />;

  return (
    <SafeAreaProvider>
      <AppProvider>
        <SessionProvider>
          <RecordsProvider>
            <Stack screenOptions={{ headerShown: false, animation: "fade", contentStyle: { backgroundColor: "#080a06" } }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="welcome" />
              <Stack.Screen name="login" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="create-report" />
              <Stack.Screen name="incident/[id]" />
              <Stack.Screen name="sos" options={{ presentation: "modal" }} />
              <Stack.Screen name="cover" options={{ animation: "none" }} />
            </Stack>
          </RecordsProvider>
        </SessionProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
