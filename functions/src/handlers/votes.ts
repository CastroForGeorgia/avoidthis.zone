/**
 * handlers/votes.ts
 *
 * An optional file if you want to
 * handle up/down voting logic in a separate function.
 * This is purely illustrative,
 * demonstrating how you might isolate domain logic.
 */

import {onCall, HttpsError} from "firebase-functions/v2/https";
import {db} from "../lib/firestore";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

// Suppose the client sends { reportId: string, voteType: "up" | "down" }
interface VoteOnReportData {
    reportId: string;
    voteType: "up" | "down";
}

export const voteOnReport = onCall(async (request):
    Promise<{ success: boolean }> => {
  const data = request.data as Partial<VoteOnReportData>;

  logger.info("Received voteOnReport request", {data});

  if (!data.reportId) {
    throw new HttpsError("invalid-argument", "Missing reportId.");
  }
  if (!data.voteType || !["up", "down"].includes(data.voteType)) {
    throw new HttpsError("invalid-argument", "Invalid voteType.");
  }

  const docRef = db.collection("raidReports").doc(data.reportId);

  // Use a transaction to avoid race conditions with concurrent votes
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(docRef);
    if (!snapshot.exists) {
      throw new HttpsError("not-found", "Report does not exist.");
    }

    const currentData = snapshot.data() || {};
    const upvoteCount = currentData.upvoteCount || 0;
    const downvoteCount = currentData.downvoteCount || 0;

    if (data.voteType === "up") {
      transaction.update(docRef, {
        upvoteCount: upvoteCount + 1,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      transaction.update(docRef, {
        downvoteCount: downvoteCount + 1,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  });

  logger.info("Vote on report successful", {reportId: data.reportId});
  return {success: true};
});
