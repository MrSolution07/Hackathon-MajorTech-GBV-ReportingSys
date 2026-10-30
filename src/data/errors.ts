export function errorText(error: unknown): string {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code === "auth/invalid-email") return "That email does not look usable.";
  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
    return "That email or password did not match.";
  }
  if (code === "auth/email-already-in-use") return "An account already uses that email.";
  if (code === "auth/weak-password") return "Use at least 8 characters.";
  if (code === "auth/network-request-failed") return "Could not reach the server. Try again.";
  if (code === "auth/requires-recent-login") return "Sign in again, then delete the account.";
  if (code === "permission-denied" || code === "firestore/permission-denied") return "The record was refused.";
  if (error instanceof Error && error.message) return error.message;
  return "Could not finish that. Try again.";
}
