import { getFirestore, doc, getDoc, Firestore } from "firebase/firestore";
import { app } from "./app";

/**
 * Firestore reference
 */
export const db: Firestore = getFirestore(app);

/**
 * fetchEnumValues:
 *  Fetch enumerations from Firestore (stored at config/enums).
 *  Make sure your Security Rules allow reads on this doc.
 */
export const fetchEnumValues = async (): Promise<Record<string, any> | null> => {
    try {
        const enumsRef = doc(db, "config", "enums");
        const snapshot = await getDoc(enumsRef);

        if (!snapshot.exists()) {
            console.error("No 'enums' doc found in 'config' collection.");
            return null;
        }

        const data = snapshot.data();
        console.log("Fetched enums:", data);
        return data || null;
    } catch (err) {
        console.error("Error fetching enums:", err);
        return null;
    }
};
