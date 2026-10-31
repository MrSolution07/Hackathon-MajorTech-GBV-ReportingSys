# SafeStep web

Landing page, organisation demo form, and a private admin desk. Practical privacy notes below are operational guardrails, not legal advice.

## Environment variables

Set these in the host (Vercel) or in `web/.env.local` for local work. Do not commit values.

| Name | Purpose |
| --- | --- |
| `FIREBASE_PROJECT_ID` | Existing Firebase project used by the mobile app |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Service account JSON, one line or base64. Server only |
| `FIREBASE_STORAGE_BUCKET` | Bucket for short-lived evidence links |
| `FIRESTORE_DATABASE_ID` | Named database. The app uses `safestep` |
| `ADMIN_EMAIL` | Comma-separated allowlist of admin emails |
| `ADMIN_PASSWORD_HASH` | Preferred. Bcrypt hash of the admin password |
| `ADMIN_PASSWORD` | Used only when `ADMIN_PASSWORD_HASH` is unset |
| `ADMIN_SESSION_SECRET` | Signs the httpOnly session cookie. At least 16 characters |
| `FIRESTORE_EMULATOR_HOST` | Local emulator only, for example `127.0.0.1:8080`. Never set this on Vercel |

`EXPO_PUBLIC_*` variables belong to the mobile app. The website does not put them in the browser.

Generate a hash without saving the password in the repo:

```bash
cd web
node scripts/hash-admin-password.mjs
```

The script reads the password from a hidden prompt, or from stdin, and prints only the hash.

To change the password, set `ADMIN_PASSWORD_HASH` to a new hash (or set `ADMIN_PASSWORD` and remove the hash) and redeploy. Open sessions stop working on the next request because the cookie is tied to the current password material. Changing `ADMIN_SESSION_SECRET` or `ADMIN_EMAIL` also needs a redeploy.

Sign-in is an email on the allowlist plus that password. The password is checked on the server. The browser receives an httpOnly cookie. `/admin` and `/api/admin/*` each check that cookie. There is no MFA on this gate. A follow-up is Firebase Authentication with an `admin` custom claim and MFA turned on in the Firebase console. Do not set that claim on a survivor account, and do not set it from the client.

## Firestore rules

Rules live in `firestore.rules` and target the named database `safestep` (`firebase.json`). Deploy them with the Firebase CLI logged in to the existing project:

```bash
npx -y firebase-tools@latest deploy --only firestore:rules --project <FIREBASE_PROJECT_ID>
```

Public clients cannot read incidents they do not own, and cannot read or write `contacts`, `demoRequests`, `auditLog`, or `rateLimits`. The website writes those through the Admin SDK, which bypasses rules. A reporter can still create, read, update, and delete their own incidents. Update and delete stay so the mobile app can change status and delete an account.

An `admin: true` custom claim may read incidents. Only the Admin SDK can set that claim.

Local checks can use the emulator:

```bash
npx -y firebase-tools@latest emulators:start --only firestore --project demo-safestep
```

## Retention, deletion, and breach notification

These periods are placeholders for an operator to confirm. They are not a legal opinion.

- Contact messages and demo requests: delete after 12 months.
- Audit log (who opened a report): delete after 24 months.
- Incident records: kept until the person deletes their account in the app, or until a verified deletion request is completed.

Deletion path: the person calls 084 998 0630 and asks for access or deletion. An authorised operator deletes the `contacts` or `demoRequests` document in the Firebase console. Incident deletion for a signed-in person is the in-app account deletion, which removes that person's incidents, entries, notices, and storage files.

Breach notification owner (POPIA s22): [assign a name, role, and contact before production use]. That person notifies the Information Regulator and affected people when the law requires it.

Real survivor data should live in a different Firebase project from demo, judging, and local emulators.

## Follow-ups

- The app does not ask for consent before saving an incident. Add an unticked checkbox and store `consentAt` and `consentVersion`. Rules already allow those optional fields.
- Strip EXIF and GPS before a photo upload.
- Stop client update and delete of incidents once status changes and account deletion move to a controlled server path.
- The app stores the owner on `ownerId`, not `uid`. Rules follow `ownerId` so the app keeps working.
- Evidence entries store a long-lived download URL. Admin detail does not return that URL. It tries to mint a five-minute signed URL from the storage path. Store the object path only, and stop calling `getDownloadURL` in the app.
- In-admin deletion of contact and demo rows, with an audit entry.
- Move this password gate to Firebase Auth, the `admin` claim, and MFA.
