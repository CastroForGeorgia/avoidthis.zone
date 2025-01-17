/**
 * lib/firestore.ts
 *
 * Firebase Admin initialization and Firestore reference.
 * All Firestore operations go through this reference to ensure a single
 * source of truth in your codebase.
 */

import * as admin from "firebase-admin";

/**
 * Initialize the Admin SDK.
 * If your environment uses default credentials, this automatically reads from
 * environment variables or local emulator settings (firebase emulators).
 */
admin.initializeApp();

export const db = admin.firestore();

// If you need references to storage, auth, etc., you can also export those.
// e.g., export const auth = admin.auth();
