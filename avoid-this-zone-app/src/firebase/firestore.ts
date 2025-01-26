import { getFirestore, doc, getDoc, Firestore } from "firebase/firestore";
import { app } from "./app";

export const db: Firestore = getFirestore(app);

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