import { getFirestore, doc, getDoc, Firestore } from "firebase/firestore";
import { app } from "./app";
import i18n from "i18next"; // Assuming i18next is configured elsewhere in your app

export const db: Firestore = getFirestore(app);

/**
 * Module-level cache for enum values.
 * This will last for as long as your app (page) remains loaded.
 */
let cachedEnumValues: Record<string, any> | null = null;

/**
 * translateEnums:
 * Helper function to map Firestore enum arrays to key-value pairs with translations.
 */
const translateEnums = (enums: Record<string, any>): Record<string, any> => {
    const translatedEnums: Record<string, any> = {};

    for (const [key, values] of Object.entries(enums)) {
        if (Array.isArray(values)) {
            // Convert array values to objects with key and translated label
            translatedEnums[key] = values.map((value: string) => ({
                key: value,
                label: i18n.t(`Enums.${key}.${value}`), // Translation lookup
            }));
        } else {
            // For non-array values, copy as-is (if needed in the future)
            translatedEnums[key] = values;
        }
    }

    return translatedEnums;
};

/**
 * fetchEnumValues:
 * Fetch enumerations from Firestore (stored at config/enums) and cache them.
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

        // 3. Translate and cache the enums
        cachedEnumValues = translateEnums(data || {});
        console.log("Translated and cached enum values:", cachedEnumValues);
        return cachedEnumValues;
    } catch (err) {
        console.error("Error fetching enums:", err);
        return null;
    }
};
