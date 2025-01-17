/**
 * index.ts
 *
 * Main entry point where we export all of our cloud functions.
 * Firebase will detect these exports and make them available for deployment.
 */

import {createRaidReport} from "./handlers/raidReports";
import {voteOnReport} from "./handlers/votes";

/**
 * Export each Cloud Function so Firebase can deploy them.
 * If you only have createRaidReport for now, just export that.
 */

// Create a new Raid Report
export {createRaidReport};

// Up/Down Vote on a raid report (optional)
export {voteOnReport};
