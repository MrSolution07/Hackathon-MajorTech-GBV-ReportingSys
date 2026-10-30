import { browserLocalPersistence, type Persistence } from "firebase/auth";

export function authPersistence(): Persistence {
  return browserLocalPersistence;
}
