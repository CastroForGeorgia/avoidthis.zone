// --------------------------------------
// TACTICS
// --------------------------------------
//
// A more extensive list of observed enforcement tactics:
// - SURVEILLANCE: ICE agents monitoring an area
// - WARRANTLESS_ENTRY: Agents forcibly entering without a proper warrant
// - RUSE: Pretending to be someone else (e.g., police, landlord, etc.)
// - COLLATERAL_ARREST: Arresting individuals not originally targeted
// - USE_OF_FORCE: Physical force used during arrest
// - CHECKPOINT / ROVING_PATROL: Setting up checkpoints
//    or patrolling near borders
// - KNOCK_AND_TALK: Agents knock on a door under a false pretense
// - ID_CHECK: Asking for IDs with no specific, targeted operation
export const ALLOWED_TACTICS = [
  "SURVEILLANCE",
  "WARRANTLESS_ENTRY",
  "RUSE",
  "COLLATERAL_ARREST",
  "USE_OF_FORCE",
  "CHECKPOINT",
  "KNOCK_AND_TALK",
  "ID_CHECK",
] as const;

export type TacticsType = typeof ALLOWED_TACTICS[number];

// --------------------------------------
// RAID LOCATION CATEGORY
// --------------------------------------
//
// General categories where raids/detentions commonly occur:
// - HOME: Private residence
// - PUBLIC: Public space (park, street, etc.)
// - WORK: Workplace or job site
// - COURT: Courthouse or court premises
// - HOSPITAL: Medical facility
// - BORDER: Border crossings or near-border communities
// - OTHER: Catch-all for locations not listed
export const ALLOWED_RAID_LOCATION_CATEGORY = [
  "HOME",
  "PUBLIC",
  "WORK",
  "COURT",
  "HOSPITAL",
  "BORDER",
  "OTHER",
] as const;

export type RaidLocationCategoryType = typeof ALLOWED_RAID_LOCATION_CATEGORY[number];

// --------------------------------------
// DETAIL LOCATION
// --------------------------------------
//
// More specific location contexts that might be relevant:
// - STREET: On a street or roadway
// - CAR_STOP: During a traffic stop
// - SHELTER: Homeless shelter or charitable facility
// - PROBATION / PAROLE: Target found at a probation or parole office
// - WORKPLACE: Specific site of employment (warehouse, factory, etc.)
// - HOSPITAL_WARD: Inside a hospital ward/room
// - IMMIGRATION_CENTER: Outside or within an immigration service center
// - BUS_TERMINAL: Bus station/terminal
// - TRAIN_STATION: Train station or platform
// - AIRPORT: Airport premises
// - OTHER_FACILITY: Catch-all for other building/facility types
export const ALLOWED_DETAIL_LOCATION = [
  "SCHOOL",
  "STREET",
  "CAR_STOP",
  "SHELTER",
  "PROBATION",
  "PAROLE",
  "WORKPLACE",
  "HOSPITAL_WARD",
  "IMMIGRATION_CENTER",
  "BUS_TERMINAL",
  "TRAIN_STATION",
  "AIRPORT",
  "OTHER_FACILITY",
] as const;

export type DetailLocationType = typeof ALLOWED_DETAIL_LOCATION[number];

// --------------------------------------
// WAS SUCCESSFUL
// --------------------------------------
export const ALLOWED_WAS_SUCCESSFUL = [
  "YES",
  "NO",
] as const;

export type WasSuccessfulType = typeof ALLOWED_WAS_SUCCESSFUL[number];

// --------------------------------------
// LOCATION REFERENCE
// --------------------------------------
//
// Non-freeform references to the location.
// - INTERSECTION: e.g. “5th & Main”
// - BUS_STOP: Bus stop area
// - TRAIN_STATION: Station platform or entrance
// - ZIP_CODE: Using a numeric ZIP code for reference
// - LANDMARK: A known city landmark (monument, park name, etc.)
// - NONE: No additional reference given
export const ALLOWED_LOCATION_REFERENCE = [
  "INTERSECTION",
  "BUS_STOP",
  "TRAIN_STATION",
  "ZIP_CODE",
  "LANDMARK",
] as const;

export type LocationReferenceType = typeof ALLOWED_LOCATION_REFERENCE[number];

// --------------------------------------
// SOURCE OF INFO
// --------------------------------------
//
// How the reporter learned about the raid/enforcement action.
// - NEWS_ARTICLE: A known media or news source
// - PERSONAL_OBSERVATION: Reporter witnessed it firsthand
// - COMMUNITY_REPORT: Another community member or group reported it
// - LEGAL_AID_ORG: A legal or advocacy organization provided info
// - PUBLIC_RECORD: Official documents or FOIA data
export const ALLOWED_SOURCE_OF_INFO = [
  "NEWS_ARTICLE",
  "PERSONAL_OBSERVATION",
  "COMMUNITY_REPORT",
  "LEGAL_AID_ORG",
  "PUBLIC_RECORD",
] as const;

export type SourceOfInfoType = typeof ALLOWED_SOURCE_OF_INFO[number];

// --------------------------------------
// CreateRaidReportPayload Interface
// --------------------------------------
/**
 * CreateRaidReportPayload: interface describing the inbound data
 * for our createRaidReport Cloud Function.
 * No freeform text allowed. Optional fields marked accordingly.
 */
export interface CreateRaidReportPayload {
  coordinates: {
    lat: number;
    lng: number;
  };
  tacticsUsed: TacticsType[];
  raidLocationCategory?: RaidLocationCategoryType | null; // Optional
  detailLocation?: DetailLocationType | null; // Optional
  wasSuccessful?: WasSuccessfulType | null; // Optional
  locationReference?: LocationReferenceType | null; // Optional
  sourceOfInfo?: SourceOfInfoType | null; // Optional
  sourceOfInfoUrl?: string | null; // Optional
}

// --------------------------------------
// RaidReportFirestoreData Interface
// --------------------------------------
/**
 * RaidReportFirestoreData: Interface describing the Firestore document shape.
 * No freeform text allowed. Optional fields marked accordingly.
 */
export interface RaidReportFirestoreData {
  coordinates: Array<{
    geopoint: FirebaseFirestore.GeoPoint;
    geohash: string;
  }>;
  tacticsUsed: TacticsType[];
  raidLocationCategory?: RaidLocationCategoryType | null; // Optional
  detailLocation?: DetailLocationType | null; // Optional
  wasSuccessful?: WasSuccessfulType | null; // Optional
  locationReference?: LocationReferenceType | null; // Optional
  sourceOfInfo?: SourceOfInfoType | null; // Optional
  sourceOfInfoUrl?: string | null; // Optional
  upvoteCount: number;
  downvoteCount: number;
  flagCount: number;
  createdAt: FirebaseFirestore.FieldValue;
  updatedAt: FirebaseFirestore.FieldValue;
}
