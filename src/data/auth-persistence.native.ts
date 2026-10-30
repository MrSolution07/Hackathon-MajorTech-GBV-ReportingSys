import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Persistence } from "firebase/auth";

type ReactNativeAuth = {
  getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
};

export function authPersistence(): Persistence {
  const nativeAuth = require("firebase/auth") as ReactNativeAuth;
  return nativeAuth.getReactNativePersistence(AsyncStorage);
}
