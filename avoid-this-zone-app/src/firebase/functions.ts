import { getFunctions, httpsCallable, Functions } from "firebase/functions";
import { app } from "./app";

/**
 * Cloud Functions instance
 */
export const functions: Functions = getFunctions(app);

/**
 * Shape of your createRaidReport payload (based on server’s interface).
 */
export interface CreateRaidReportPayload {
    lat: number;
    lng: number;
    dateOfRaid: string;
    tacticsUsed: string[];
    raidLocationCategory: string;
    detailLocation: string;
    wasSuccessful: string;
    numberOfPeopleDetained: number;
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
