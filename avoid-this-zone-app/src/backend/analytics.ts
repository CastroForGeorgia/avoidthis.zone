import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { app } from "./app";

let analytics: Analytics | undefined;

isSupported().then((supported) => {
    if (supported) {
        analytics = getAnalytics(app);
        console.log("Analytics initialized.");
    } else {
        console.log("Analytics not supported in this environment.");
    }
});

export { analytics };
