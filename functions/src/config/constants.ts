/**
 * config/constants.ts
 *
 * This file stores all enumerations, union types,
 * and shared TypeScript interfaces.
 * It ensures there's no freeform text by explicitly listing allowable values.
 */

// For "tacticsUsed"
export const ALLOWED_TACTICS = [
  "Surveillance",
  "Warrantless Entry",
  "Ruse",
  "Collateral Arrest",
  "Use of Force",
] as const;

export type TacticsType = typeof ALLOWED_TACTICS[number];

export const ALLOWED_RAID_LOCATION_CATEGORY = [
  "Home",
  "Public",
  "Work",
  "Other",
] as const;

export type RaidLocationCategoryType =
    typeof ALLOWED_RAID_LOCATION_CATEGORY[number];

export const ALLOWED_DETAIL_LOCATION = [
  "Street",
  "CarStop",
  "Shelter",
  "Probation",
  "Parole",
  "Workplace",
] as const;

export type DetailLocationType = typeof ALLOWED_DETAIL_LOCATION[number];

export const ALLOWED_WAS_ICE_SUCCESSFUL = [
  "Yes",
  "No",
  "Unknown",
] as const;

export type WasICESuccessfulType = typeof ALLOWED_WAS_ICE_SUCCESSFUL[number];

export const ALLOWED_LOCATION_REFERENCE = [
  "ZIP",
  "ADDRESS",
  "INTERSECTION",
  "NONE",
] as const;

export type LocationReferenceType = typeof ALLOWED_LOCATION_REFERENCE[number];

export const ALLOWED_SOURCE_OF_INFO = [
  "NewsArticle",
  "PersonalObservation",
  "CommunityReport",
  "Unknown",
] as const;

export type SourceOfInfoType = typeof ALLOWED_SOURCE_OF_INFO[number];

/**
   * CreateRaidReportPayload: interface describing the inbound data
   * for our createRaidReport Cloud Function. No freeform text allowed.
   */
export interface CreateRaidReportPayload {
    lat: number;
    lng: number;
    geohash: string;
    dateOfRaid: string; // e.g. "2025-01-16T10:00:00.000Z"
    tacticsUsed: TacticsType[];
    raidLocationCategory: RaidLocationCategoryType;
    detailLocation: DetailLocationType;
    wasICESuccessful: WasICESuccessfulType;
    numberOfPeopleDetained: number;
    locationReference: LocationReferenceType;
    sourceOfInfo: SourceOfInfoType;
  }

/**
   * Data shape for documents inside the 'raidReports' collection in Firestore.
   * No freeform text. All enumerations come from the above constants.
   */
export interface RaidReportFirestoreData {
    g: {
      geopoint: FirebaseFirestore.GeoPoint;
      geohash: string;
    };
    dateOfRaid: FirebaseFirestore.Timestamp;
    tacticsUsed: TacticsType[];
    raidLocationCategory: RaidLocationCategoryType;
    detailLocation: DetailLocationType;
    wasICESuccessful: WasICESuccessfulType;
    numberOfPeopleDetained: number;
    locationReference: LocationReferenceType;
    sourceOfInfo: SourceOfInfoType;
    upvoteCount: number;
    downvoteCount: number;
    flagCount: number;
    createdAt: FirebaseFirestore.FieldValue;
    updatedAt: FirebaseFirestore.FieldValue;
  }
