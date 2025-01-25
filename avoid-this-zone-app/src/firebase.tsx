import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getAuth,
    signInAnonymously,
    onAuthStateChanged
} from "firebase/auth";

// NEW imports for Firestore
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Your existing Firebase config
// Your existing Firebase config
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Auth
const auth = getAuth(app);

/** 
 * Anonymous sign-in function
 */
export const signInAnonymouslyIfNeeded = async () => {
    if (!auth.currentUser) {
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error('Anonymous sign-in failed', error);
        }
    }
};

/** 
 * Auth state listener
 */
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in (anon): ', user.uid);
    } else {
        console.log('User is signed out');
    }
});

/**
 * Firestore reference. We'll reuse 'db' for data reads.
 */
const db = getFirestore(app);

/**
 * fetchEnumValues
 * 
 * Retrieves the enumerations stored in Firestore at config/enums.
 * 
 * Make sure your Firestore Security Rules allow "read" on this doc 
 * (and not "write" from clients, typically).
 */
export const fetchEnumValues = async () => {
    try {
        // 1. Reference the doc
        const enumsRef = doc(db, "config", "enums");

        // 2. Retrieve the doc snapshot
        const snapshot = await getDoc(enumsRef);

        if (!snapshot.exists()) {
            console.error("No 'enums' doc found in 'config' collection.");
            return null;
        }

        // 3. Return the data 
        //    e.g. {
        //      ALLOWED_TACTICS: [...],
        //      ALLOWED_RAID_LOCATION_CATEGORY: [...],
        //      ...
        //    }
        const data = snapshot.data();
        console.log("Fetched enums:", data);
        return data;
    } catch (err) {
        console.error("Error fetching enums:", err);
        return null;
    }
};

export default app;
export { auth, db };