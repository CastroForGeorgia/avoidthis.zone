import {
    getAuth,
    signInAnonymously,
    onAuthStateChanged,
    User,
    connectAuthEmulator
} from "firebase/auth";
import { app } from "./app";

/**
 * Auth instance from initialized Firebase app
 */
export const auth = getAuth(app);

// Check if in development mode
if (process.env.NODE_ENV === "development") {
    console.log("Connecting to Firebase emulators...");

    // Connect Authentication Emulator
    connectAuthEmulator(auth, "http://127.0.0.1:9099", {
        disableWarnings: true,
    });
}

/**
 * signInAnonymouslyIfNeeded:
 *  Checks if there's a currentUser, and if not, attempts an anonymous sign-in.
 */
export const signInAnonymouslyIfNeeded = async (): Promise<void> => {
    if (!auth.currentUser) {
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error("Anonymous sign-in failed", error);
        }
    }
};

/**
 * Optional: An example auth state listener
 */
onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
        console.log("User is signed in (anon): ", user.uid);
    } else {
        console.log("User is signed out");
    }
});
