export default {
    translation: {
        Index: {
            applicationLoadErrorMessage: 'Error while loading the application',
            applicationLoadErrorDescription:
                'The application with ID {{applicationId}} could not be loaded correctly. ' +
                "You're seeing the default application configuration.",
            errorMessage: 'Error while loading the application',
            errorDescription:
                'An unexpected error occurred while loading the application. Please try to reload the page.',
            reloadButton: 'Reload Application',
        },
        BasicNominatimSearch: {
            placeholder: 'Place name, street name, district name, POI, etc.',
            noResultsMessage: 'No results found. Try refining your search.',
        },
        SideDrawer: {
            title: 'Filters',
            languageSwitcher: {
                label: "Select Language"
            },
            clearAllButton: 'Clear All Filters',
            applyButton: 'Apply Filters',
        },
        ToggleDrawerButton: {
            tooltip: 'Show/hide Filters',
        },
        ReportModal: {
            title: 'Submit a Report',
            loadingMessage: 'Loading...',
            successMessage: 'Your report has been successfully submitted!',
            errorMessage: 'Failed to submit the report. Please try again.',
            cancelButton: 'Cancel',
            submitButton: 'Submit',
            resetButton: 'Reset',
            formErrors: {
                requiredField: 'This field is required.',
                invalidDate: "This date is invalid.",
                invalidUrl: "Please enter a valid URL."

            },
            labels: {
                tactics: 'Tactics',
                filters: "Details",
                raidLocationCategory: 'Raid Location Category',
                detailLocation: 'Detail Location',
                wasSuccessful: 'Was anyone detained?',
                locationReference: 'Location Reference',
                sourceOfInfo: 'Source of Information',
                dateOfRaid: '(Optional) Date',
                sourceOfInfoUrl: "Source URL",
                sourceOfInfoUrlPlaceholder: "Enter the URL of the source (if applicable)"

            },
        },
        Enums: {
            ALLOWED_TACTICS: {
                SURVEILLANCE: 'Surveillance',
                WARRANTLESS_ENTRY: 'Warrantless Entry',
                RUSE: 'Ruse',
                COLLATERAL_ARREST: 'Collateral Arrest',
                USE_OF_FORCE: 'Use of Force',
                CHECKPOINT: 'Checkpoint',
                KNOCK_AND_TALK: 'Knock and Talk',
                ID_CHECK: 'ID Check',
            },
            ALLOWED_RAID_LOCATION_CATEGORY: {
                HOME: 'Home',
                PUBLIC: 'Public',
                WORK: 'Work',
                COURT: 'Court',
                HOSPITAL: 'Hospital',
                BORDER: 'Border',
                OTHER: 'Other',
            },
            ALLOWED_DETAIL_LOCATION: {
                STREET: 'Street',
                CAR_STOP: 'Car Stop',
                SHELTER: 'Shelter',
                PROBATION: 'Probation Office',
                PAROLE: 'Parole Office',
                WORKPLACE: 'Workplace',
                HOSPITAL_WARD: 'Hospital Ward',
                IMMIGRATION_CENTER: 'Immigration Center',
                BUS_TERMINAL: 'Bus Terminal',
                TRAIN_STATION: 'Train Station',
                AIRPORT: 'Airport',
                OTHER_FACILITY: 'Other Facility',
                SCHOOL: "School"
            },
            ALLOWED_WAS_SUCCESSFUL: {
                YES: 'Yes',
                NO: 'No',
                UNKNOWN: 'Unknown',
            },
            ALLOWED_LOCATION_REFERENCE: {
                INTERSECTION: 'Intersection',
                BUS_STOP: 'Bus Stop',
                TRAIN_STATION: 'Train Station',
                ZIP_CODE: 'ZIP Code',
                LANDMARK: 'Landmark',
                NONE: 'None',
            },
            ALLOWED_SOURCE_OF_INFO: {
                NEWS_ARTICLE: 'News Article',
                PERSONAL_OBSERVATION: 'Personal Observation',
                COMMUNITY_REPORT: 'Community Report',
                PUBLIC_RECORD: 'Public Record',
                LEGAL_AID_ORG: "Organization"
            },
        },
        Common: {
            loadingMessage: 'Loading, please wait...',
            errorOccurred: 'An error occurred. Please try again later.',
            backButton: 'Back',
            nextButton: 'Next',
            resetButton: 'Reset',
            closeButton: 'Close',
            searchPlaceholder: 'Search...',
            confirmButton: 'Confirm',
            cancelButton: 'Cancel',
            unknown: "Unknown",
            createdAt: "CreatedAt",
            viewOnMap: "View On Map",
            navigate: "View On Map"
        },
    },
};
