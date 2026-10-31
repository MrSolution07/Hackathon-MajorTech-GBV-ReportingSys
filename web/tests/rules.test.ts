import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const host = process.env.FIRESTORE_EMULATOR_HOST ?? "";
const emulator = /^(127\.0\.0\.1|localhost):\d+$/.test(host);

test("firestore rules lock reports, contacts and demos", { skip: emulator ? false : "Firestore emulator is not running" }, async () => {
  const [testing, firestore] = await Promise.all([
    import("@firebase/rules-unit-testing"),
    import("firebase/firestore"),
  ]);
  const [hostname, port] = host.split(":");
  const rules = readFileSync(join(import.meta.dirname, "../../firestore.rules"), "utf8");
  const testEnv = await testing.initializeTestEnvironment({
    projectId: "demo-safestep",
    firestore: { rules, host: hostname, port: Number(port) },
  });
  try {
    await testEnv.clearFirestore();
    const incident = {
      ownerId: "user-a",
      type: "harassment",
      platform: "WhatsApp",
      occurredAt: "1 June, 9:00",
      summary: "Synthetic rules check.",
      status: "saved",
      sample: false,
      createdAt: 1,
      updatedAt: 1,
    };
    const owner = testEnv.authenticatedContext("user-a");
    const other = testEnv.authenticatedContext("user-b");
    const anon = testEnv.unauthenticatedContext();
    const admin = testEnv.authenticatedContext("admin-user", { admin: true });
    await testing.assertSucceeds(firestore.setDoc(firestore.doc(owner.firestore(), "incidents", "i1"), incident));
    await testing.assertFails(
      firestore.setDoc(firestore.doc(owner.firestore(), "incidents", "i2"), { ...incident, ownerId: "user-b" }),
    );
    await testing.assertSucceeds(firestore.getDoc(firestore.doc(owner.firestore(), "incidents", "i1")));
    await testing.assertFails(firestore.getDoc(firestore.doc(other.firestore(), "incidents", "i1")));
    await testing.assertFails(firestore.getDoc(firestore.doc(anon.firestore(), "incidents", "i1")));
    await testing.assertSucceeds(firestore.getDoc(firestore.doc(admin.firestore(), "incidents", "i1")));
    await testing.assertSucceeds(
      firestore.updateDoc(firestore.doc(owner.firestore(), "incidents", "i1"), { status: "prepared", updatedAt: 2 }),
    );
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await firestore.setDoc(firestore.doc(context.firestore(), "contacts", "c1"), { email: "a@example.com" });
      await firestore.setDoc(firestore.doc(context.firestore(), "demoRequests", "d1"), { email: "a@example.com" });
      await firestore.setDoc(firestore.doc(context.firestore(), "auditLog", "a1"), { reportId: "i1" });
    });
    for (const context of [anon, owner, admin]) {
      await testing.assertFails(firestore.getDoc(firestore.doc(context.firestore(), "contacts", "c1")));
      await testing.assertFails(firestore.setDoc(firestore.doc(context.firestore(), "contacts", "c2"), { email: "b@example.com" }));
      await testing.assertFails(firestore.getDoc(firestore.doc(context.firestore(), "demoRequests", "d1")));
      await testing.assertFails(firestore.getDoc(firestore.doc(context.firestore(), "auditLog", "a1")));
    }
    await testing.assertSucceeds(firestore.getDoc(firestore.doc(anon.firestore(), "resources", "helpline")));
    await testing.assertFails(firestore.setDoc(firestore.doc(anon.firestore(), "resources", "helpline"), { name: "nope" }));
  } finally {
    await testEnv.cleanup();
  }
});
