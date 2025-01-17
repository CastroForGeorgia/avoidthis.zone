import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
    getAuth,
    signInAnonymously,
    onAuthStateChanged,
} from 'firebase/auth';

// TODO: Replace with your own Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCO80DNSSNFMTxQsuZX9kxnTRwQ-hldKFQ",
    authDomain: "avoidthiszone.firebaseapp.com",
    projectId: "avoidthiszone",
    storageBucket: "avoidthiszone.firebasestorage.app",
    messagingSenderId: "1057388013519",
    appId: "1:1057388013519:web:18349cb9e234b5a4e514ba",
    measurementId: "G-4ZWW3VETHM"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Get the Auth instance
const auth = getAuth(app);

// Anonymous sign-in function
export const signInAnonymouslyIfNeeded = async () => {
    // If the user is not already logged in, sign them in anonymously
    if (!auth.currentUser) {
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error('Anonymous sign-in failed', error);
        }
    }
};

// Listener for auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in (anon): ', user.uid);
    } else {
        console.log('User is signed out');
    }
});

export default app;
export { auth };
