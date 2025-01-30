import { getFunctions, httpsCallable, Functions, connectFunctionsEmulator } from "firebase/functions";
import { app } from "./app";

/**
 * Cloud Functions instance
 */
export const functions: Functions = getFunctions(app);
// Check if in development mode
if (process.env.NODE_ENV === "development") {
    console.log("Connecting to Firebase emulators...");
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

/**
 * Shape of your createRaidReport payload (based on server’s interface).
 */
export interface CreateRaidReportPayload {
    coordinates: {
        lat: number;
        lng: number;
      };
    dateOfRaid: string;
    tacticsUsed: string[];
    raidLocationCategory: string;
    detailLocation: string;
    wasSuccessful: string;
    locationReference: string;
    sourceOfInfo: string;
}

/**
 * createRaidReport:
 *  A client-side callable for your `createRaidReport` Cloud Function.
 */
export const createRaidReport = async (
    payload: CreateRaidReportPayload
): Promise<string> => {
    try {
        // match the name of your deployed cloud function
        const callCreateRaidReport = httpsCallable<
            CreateRaidReportPayload,
            { id: string }
        >(functions, "createRaidReport");

        const result = await callCreateRaidReport(payload);
        return result.data.id;
    } catch (error) {
        console.error("Error calling createRaidReport:", error);
        throw error;
    }
};
