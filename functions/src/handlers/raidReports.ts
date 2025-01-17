/**
 * handlers/raidReports.ts
 *
 * Defines our Cloud Function for creating raid reports.
 * It imports enumerations and interfaces from constants.ts
 * and uses the Firestore Admin instance from lib/firestore.ts.
 */

import {onCall, HttpsError} from "firebase-functions/v2/https";
import {db} from "../lib/firestore";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

// Import enumerations and interfaces
import {
  ALLOWED_TACTICS,
  ALLOWED_RAID_LOCATION_CATEGORY,
  ALLOWED_DETAIL_LOCATION,
  ALLOWED_WAS_SUCCESSFUL,
  ALLOWED_LOCATION_REFERENCE,
  ALLOWED_SOURCE_OF_INFO,
  CreateRaidReportPayload,
  RaidReportFirestoreData,
} from "../config/constants";
import {geohashForLocation} from "geofire-common";

/**
 * createRaidReport:
 *  A callable Cloud Function that validates input data, then
 *  creates a new document in the 'raidReports' collection.
 */
export const createRaidReport = onCall(async (request):
Promise<{ id: string }> => {
  // Cast the incoming data to the partial shape of our payload
  const data = request.data as Partial<CreateRaidReportPayload>;

  logger.info("Received createRaidReport request", {data});

  // 1. Validate mandatory fields
  if (!data.lat || !data.lng) {
    throw new HttpsError("invalid-argument", "Missing lat, lng.");
  }

  if (!data.dateOfRaid) {
    throw new HttpsError("invalid-argument", "Missing dateOfRaid.");
  }

  // 2. Validate arrays and enums
  if (!Array.isArray(data.tacticsUsed) ||
      !data.tacticsUsed.every((t) => ALLOWED_TACTICS.includes(t))) {
    throw new HttpsError("invalid-argument", "Invalid tacticsUsed.");
  }

  if (!data.raidLocationCategory ||
      !ALLOWED_RAID_LOCATION_CATEGORY.includes(data.raidLocationCategory)) {
    throw new HttpsError("invalid-argument", "Invalid raidLocationCategory.");
  }

  if (!data.detailLocation ||
      !ALLOWED_DETAIL_LOCATION.includes(data.detailLocation)) {
    throw new HttpsError("invalid-argument", "Invalid detailLocation.");
  }

  if (!data.wasSuccessful ||
      !ALLOWED_WAS_SUCCESSFUL.includes(data.wasSuccessful)) {
    throw new HttpsError("invalid-argument", "Invalid wasICESuccessful.");
  }

  if (typeof data.numberOfPeopleDetained !== "number") {
    throw new HttpsError("invalid-argument",
      "numberOfPeopleDetained must be a number.");
  }

  if (!data.locationReference ||
      !ALLOWED_LOCATION_REFERENCE.includes(data.locationReference)) {
    throw new HttpsError("invalid-argument", "Invalid locationReference.");
  }

  if (!data.sourceOfInfo ||
      !ALLOWED_SOURCE_OF_INFO.includes(data.sourceOfInfo)) {
    throw new HttpsError("invalid-argument", "Invalid sourceOfInfo.");
  }

  // 3. Convert dateOfRaid to a Firestore Timestamp
  const raidTimestamp =
    admin.firestore.Timestamp.fromDate(new Date(data.dateOfRaid));

  // 4. Construct the Firestore data object
  const reportData: RaidReportFirestoreData = {
    g: {
      geopoint: new admin.firestore.GeoPoint(data.lat, data.lng),
      geohash: geohashForLocation([data.lat, data.lng]),
    },
    dateOfRaid: raidTimestamp,
    tacticsUsed: data.tacticsUsed,
    raidLocationCategory: data.raidLocationCategory,
    detailLocation: data.detailLocation,
    wasSuccessful: data.wasSuccessful,
    numberOfPeopleDetained: data.numberOfPeopleDetained,
    locationReference: data.locationReference,
    sourceOfInfo: data.sourceOfInfo,
    upvoteCount: 0,
    downvoteCount: 0,
    flagCount: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // 5. Write to Firestore
  const docRef = await db.collection("raidReports").add(reportData);
  logger.info("Created raid report document", {docId: docRef.id});

  // Return the document ID to the client
  return {id: docRef.id};
});
