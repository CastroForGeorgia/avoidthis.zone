import { getFirestore, doc, getDoc, Firestore, connectFirestoreEmulator, collection, getDocs, limit, orderBy, query, Timestamp } from "firebase/firestore";
import { app } from "./app";

export const db: Firestore = getFirestore(app);
// Check if in development mode
if (process.env.NODE_ENV === "development") {
    console.log("Connecting to Firebase emulators...");

    // Connect Firestore Emulator
    connectFirestoreEmulator(db, "127.0.0.1", 8000);
}

export interface RaidReportFirestoreData {
    id: string
    coordinates: Array<{
      geopoint: {
        latitude: number;
        longitude: number;
      };
      geohash: string;
    }>;
    dateOfRaid?: Timestamp | null;
    tacticsUsed: string[];
    raidLocationCategory: string;
    detailLocation: string;
    wasSuccessful: string;
    locationReference: string;
    sourceOfInfo: string;
    sourceOfInfoUrl: string;
    upvoteCount: number;
    downvoteCount: number;
    flagCount: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  }
  
/**
 * Module-level cache for enum values.
 * This will last for as long as your app (page) remains loaded.
 */
let cachedEnumValues: Record<string, any> | null = null;

/**
 * fetchEnumValues:
 *  Fetch enumerations from Firestore (stored at config/enums) and cache them.
 */
export const fetchEnumValues = async (): Promise<Record<string, any> | null> => {
    // 1. If we already have them cached in memory, return immediately
    if (cachedEnumValues) {
        console.log("Returning cached enum values:", cachedEnumValues);
        return cachedEnumValues;
    }

    // 2. Otherwise, fetch from Firestore
    try {
        const enumsRef = doc(db, "config", "enums");
        const snapshot = await getDoc(enumsRef);

        if (!snapshot.exists()) {
            console.error("No 'enums' doc found in 'config' collection.");
            return null;
        }

        const data = snapshot.data();
        console.log("Fetched enums from Firestore:", data);

        // 3. Cache in memory
        cachedEnumValues = data || null;
        return cachedEnumValues;
    } catch (err) {
        console.error("Error fetching enums:", err);
        return null;
    }
};