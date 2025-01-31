import {onCall, HttpsError} from "firebase-functions/v2/https";
import {db} from "../lib/firestore";
import * as logger from "firebase-functions/logger";
import {geohashForLocation} from "geofire-common";

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

// Import utility for randomizing points
import {generateRandomPins} from "../utils/geoUtils";
import {FieldValue, GeoPoint} from "firebase-admin/firestore";
import validator from "validator";


/**
 * createRaidReport:
 * A callable Cloud Function that validates input data, then
 * creates a new document in the 'raidReports' collection.
 */
export const createRaidReport = onCall(
  async (request): Promise<{ id: string }> => {
    const data = request.data as Partial<CreateRaidReportPayload>;

    logger.info("Received createRaidReport request", {data});

    // Validate mandatory fields
    if (!data.coordinates?.lat || !data.coordinates?.lng) {
      throw new HttpsError("invalid-argument",
        "Missing or invalid coordinates.");
    }

    if (!Array.isArray(data.tacticsUsed) ||
      !data.tacticsUsed.every((t) => ALLOWED_TACTICS.includes(t))) {
      throw new HttpsError("invalid-argument", "Invalid tacticsUsed.");
    }

    if (data.raidLocationCategory &&
      !ALLOWED_RAID_LOCATION_CATEGORY.includes(data.raidLocationCategory)) {
      throw new HttpsError("invalid-argument",
        "Invalid raidLocationCategory.");
    }

    if (data.detailLocation &&
      !ALLOWED_DETAIL_LOCATION.includes(data.detailLocation)) {
      throw new HttpsError("invalid-argument", "Invalid detailLocation.");
    }

    if (data.wasSuccessful &&
      !ALLOWED_WAS_SUCCESSFUL.includes(data.wasSuccessful)) {
      throw new HttpsError("invalid-argument",
        "Invalid wasSuccessful.");
    }

    if (data.locationReference &&
      !ALLOWED_LOCATION_REFERENCE.includes(data.locationReference)) {
      throw new HttpsError("invalid-argument", "Invalid locationReference.");
    }

    if (data.sourceOfInfo &&
      !ALLOWED_SOURCE_OF_INFO.includes(data.sourceOfInfo)) {
      throw new HttpsError("invalid-argument", "Invalid sourceOfInfo.");
    }

    if (data.sourceOfInfoUrl && !isValidUrl(data.sourceOfInfoUrl)) {
      throw new HttpsError("invalid-argument", "Invalid sourceOfInfoUrl.");
    }

    // Generate random pins around the given coordinate
    const randomizedCoordinates = generateRandomPins(
      [data.coordinates.lat, data.coordinates.lng],
      10, // Radius in meters
      1 // Number of random points
    );

    // Convert randomized coordinates to Firestore format
    const coordinatesData = randomizedCoordinates.map(({lat, lon}) => ({
      geopoint: new GeoPoint(lat, lon),
      geohash: geohashForLocation([lat, lon]),
    }));

    // Construct Firestore data object
    const reportData: RaidReportFirestoreData = {
      coordinates: coordinatesData, // Store the array of randomized coordinates
      tacticsUsed: data.tacticsUsed,
      raidLocationCategory: data.raidLocationCategory || null, // Optional field
      detailLocation: data.detailLocation || null, // Optional field
      wasSuccessful: data.wasSuccessful || null, // Optional field
      locationReference: data.locationReference || null, // Optional field
      sourceOfInfo: data.sourceOfInfo || null, // Optional field
      sourceOfInfoUrl: data.sourceOfInfoUrl || null, // Optional field
      upvoteCount: 0,
      downvoteCount: 0,
      flagCount: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Write to Firestore
    const docRef = await db.collection("raidReports").add(reportData);
    logger.info("Created raid report document", {docId: docRef.id});

    return {id: docRef.id};
  });

/**
 * Validates whether a given string is a valid URL.
 *
 * @param {string} url - The URL string to validate.
 * @return {boolean} - Returns true if the URL is valid, otherwise false.
 */
function isValidUrl(url: string): boolean {
  return validator.isURL(url); // Directly return the validation result
}
