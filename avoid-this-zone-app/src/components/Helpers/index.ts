 // Updated Tag color mappings based on your current enums.
 export const TAG_COLORS: Record<string, Record<string, string>> = {
    ALLOWED_TACTICS: {
      SURVEILLANCE: "blue",
      WARRANTLESS_ENTRY: "red",
      RUSE: "purple",
      COLLATERAL_ARREST: "volcano",
      USE_OF_FORCE: "magenta",
      CHECKPOINT: "geekblue",
      KNOCK_AND_TALK: "cyan",
      ID_CHECK: "green",
    },
    ALLOWED_RAID_LOCATION_CATEGORY: {
      HOME: "green",
      PUBLIC: "blue",
      WORK: "gold",
      COURT: "purple",
      HOSPITAL: "volcano",
      BORDER: "red",
      OTHER: "default",
    },
    ALLOWED_DETAIL_LOCATION: {
      STREET: "blue",
      CAR_STOP: "geekblue",
      SHELTER: "green",
      PROBATION: "purple",
      PAROLE: "magenta",
      WORKPLACE: "gold",
      HOSPITAL_WARD: "volcano",
      IMMIGRATION_CENTER: "red",
      BUS_TERMINAL: "cyan",
      TRAIN_STATION: "geekblue",
      AIRPORT: "blue",
      OTHER_FACILITY: "default",
      SCHOOL: "green",
    },
    ALLOWED_WAS_SUCCESSFUL: {
      YES: "green",
      NO: "red",
      UNKNOWN: "default",
    },
    ALLOWED_LOCATION_REFERENCE: {
      INTERSECTION: "geekblue",
      BUS_STOP: "cyan",
      TRAIN_STATION: "blue",
      ZIP_CODE: "volcano",
      LANDMARK: "purple",
      NONE: "default",
    },
    ALLOWED_SOURCE_OF_INFO: {
      NEWS_ARTICLE: "blue",
      PERSONAL_OBSERVATION: "green",
      COMMUNITY_REPORT: "orange",
      PUBLIC_RECORD: "purple",
      LEGAL_AID_ORG: "magenta",
    },
  };

  // Function to determine the color for a given enum field and value.
  export const getTagColor = (enumKey: string, value: string): string => {
    const mapping = TAG_COLORS[enumKey];
    if (mapping && mapping[value]) {
      return mapping[value];
    }
    return "default"; // fallback color if no mapping exists
  };