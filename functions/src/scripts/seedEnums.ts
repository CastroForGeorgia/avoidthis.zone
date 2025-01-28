/**
 * scripts/seedEnums.ts
 * GOOGLE_APPLICATION_CREDENTIALS=$HOME/.config/gcloud/application_default_credentials.json FIRESTORE_EMULATOR_HOST=127.0.0.1:9000 ts-node src/scripts/seedEnums.ts
 *
 * This script seeds the "config/enums" document in Firestore
 * with all allowed enumerations, so front-end clients (and any other
 * services) can query them without needing code redeploys.
 */

import * as admin from "firebase-admin";

// 1. If you haven't already, ensure you have a service account or
//    default credentials. For local, you might set the GOOGLE_APPLICATION_CREDENTIALS env var.
//    For the emulator, it might just pick up your local credentials automatically.
admin.initializeApp(
  {
    projectId: "avoidthiszone",
  });

// 2. Reference Firestore
const db = admin.firestore();

// 3. Import the enumerations from your constants file
//    Make sure the path is correct relative to this script’s location.
import {
  ALLOWED_TACTICS,
  ALLOWED_RAID_LOCATION_CATEGORY,
  ALLOWED_DETAIL_LOCATION,
  ALLOWED_WAS_SUCCESSFUL,
  ALLOWED_LOCATION_REFERENCE,
  ALLOWED_SOURCE_OF_INFO,
} from "../config/constants";

// 4. The main async function to run
async function seedEnums() {
  try {
    // Prepare the data object
    const data = {
      ALLOWED_TACTICS: Array.from(ALLOWED_TACTICS),
      ALLOWED_RAID_LOCATION_CATEGORY: Array.from(ALLOWED_RAID_LOCATION_CATEGORY),
      ALLOWED_DETAIL_LOCATION: Array.from(ALLOWED_DETAIL_LOCATION),
      ALLOWED_WAS_SUCCESSFUL: Array.from(ALLOWED_WAS_SUCCESSFUL),
      ALLOWED_LOCATION_REFERENCE: Array.from(ALLOWED_LOCATION_REFERENCE),
      ALLOWED_SOURCE_OF_INFO: Array.from(ALLOWED_SOURCE_OF_INFO),
    };

    // Write the data to "config/enums"
    await db.collection("config").doc("enums").set(data, {merge: true});

    console.log("Successfully seeded enums into Firestore at config/enums");
  } catch (error) {
    console.error("Error seeding enums:", error);
  }
}

// 5. Invoke the function
seedEnums().then(() => {
  console.log("Seeding process complete. Exiting...");
  process.exit(0);
});
