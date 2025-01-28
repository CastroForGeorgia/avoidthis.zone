# Raid Reports Firebase Project

A **Firebase**-based application that helps communities—especially **immigrants**—stay informed about **raids** or **enforcement events** in their area. By **limiting all data** to **strictly validated enumerations** (no freeform text) and running **writes through Cloud Functions**, this project **safeguards** sensitive information, prioritizes **user anonymity**, and **prevents** malicious or unverified data from corrupting the system.

## Table of Contents

1. [Overview](#overview)  
2. [Core Principles](#core-principles)  
3. [Project Structure](#project-structure)  
4. [Setup & Installation](#setup--installation)  
5. [Local Development (Emulator)](#local-development-emulator)  
6. [Deployment](#deployment)  
7. [Data Model & Firestore Rules](#data-model--firestore-rules)  
8. [Indexing](#indexing)  
9. [Usage](#usage)  
10. [Contributing](#contributing)  
11. [License](#license)

---

## 1. Overview

This repository demonstrates a **Firebase** application that allows **anonymous, structured “raid reports”** to be created and shared. The data can include **geolocation** for map-based visualization, but **freeform text is disallowed** to preserve user privacy and **protect** communities from potential doxxing or malicious content. All writes are enforced by **Cloud Functions** that **validate** data against a set of **enumerations**—no raw client writes to Firestore are permitted.

**Key Features**:
- **Raid Report Submission**: Users specify geolocation, date of raid, tactics used, and other critical fields—**only from enumerations** (no freeform).  
- **Geo-Queries** (via geohash): Each report is stored with a `geohash` and `GeoPoint`, enabling efficient location-based lookups.  
- **Voting/Flagging (Optional)**: Community members can upvote or downvote the accuracy of raid reports. Flags help identify inaccuracies or duplicates.  
- **Strict Security**: Firestore security rules block all direct writes, so only validated data enters the database through Cloud Functions.  

This tool embodies the **“us vs. the system”** ethos by **empowering** vulnerable individuals and the working class to share vital information **without** giving big-money or elite institutions an opening to collect or exploit personal data.

---

## 2. Core Principles

1. **No Freeform Text**: All user inputs are chosen from finite lists or numeric fields—protecting privacy and preventing data abuse.  
2. **Community Control**: All data is **publicly readable** (configurable) but only **writable** via secure Cloud Functions—blocking manipulation from unscrupulous outside forces.  
3. **Transparency & Unity**: Data integrity is paramount. We **stand together** against corporate or political meddling by **centering** the working class in our design.  

---

## 3. Project Structure

```
functions/
├─ package.json
├─ tsconfig.json
├─ src/
│  ├─ index.ts               // Entry point: exports all functions
│  ├─ lib/
│  │  └─ firestore.ts        // Admin SDK init & Firestore reference
│  ├─ config/
│  │  └─ constants.ts        // Enumerations, TypeScript types, no freeform text
│  ├─ handlers/
│  │  ├─ raidReports.ts      // createRaidReport function
│  │  └─ votes.ts            // (Optional) up/downvote function logic
└─ ...
firestore.rules              // Firestore security rules
firestore.indexes.json       // Firestore composite indexes
firebase.json                // Firebase config
README.md                    // You're reading this now
```

### Notable Files

- **`lib/firestore.ts`**: Initializes the **Admin SDK** (bypassing security rules) and exports a `db` reference.  
- **`config/constants.ts`**: Lists **allowed enumerations** (e.g., “Surveillance,” “Home,” “Public,” etc.) and shared **TypeScript types** for consistent usage across functions.  
- **`handlers/raidReports.ts`**: Implements the `createRaidReport` Cloud Function, validating incoming data, constructing Firestore documents, and storing them in the `raidReports` collection.  
- **`handlers/votes.ts`** (Optional): Example of a separate function to handle up/down votes on reports.  

---

## 4. Setup & Installation

1. **Clone** this repo to your local machine:
   ```bash
   git clone https://github.com/<your-org>/raid-reports-firebase.git
   cd raid-reports-firebase/functions
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn
   ```

3. **Firebase CLI**: Make sure you have the [Firebase CLI](https://firebase.google.com/docs/cli#setup_update_cli) installed:
   ```bash
   npm install -g firebase-tools
   ```
4. **Login** and **init** if you haven’t:
   ```bash
   firebase login
   firebase init
   ```

---

## 5. Local Development (Emulator)

1. **Enable** the local **Emulator Suite** in your project:
   ```bash
   firebase init emulators
   ```
2. **Start** the emulator:
   ```bash
   firebase emulators:start
   ```
3. You can now invoke functions locally (HTTP-based or `onCall`) and interact with an **in-memory Firestore** instance. This helps test your logic **without** modifying production data.

---

## 6. Deployment

1. **Build** (TypeScript → JavaScript):
   ```bash
   cd functions
   npm run build
   ```
   or just rely on the emulator if you’re testing locally.
2. **Deploy functions**:
   ```bash
   firebase deploy --only functions
   ```
3. **Deploy rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```
4. **Deploy indexes** (if needed):
   ```bash
   firebase deploy --only firestore:indexes
   ```

---

## 7. Data Model & Firestore Rules

**Collection**: `raidReports`  
- **`g.geopoint`**: Firestore GeoPoint object (for location).  
- **`g.geohash`**: String for geospatial queries (GeoFire approach).  
- **`tacticsUsed`**: Array of enumerated tactics.  
- **`raidLocationCategory`**: “Home,” “Public,” “Work,” or “Other.”  
- **`detailLocation`**: “Street,” “CarStop,” “Shelter,” “Workplace,” etc.  
- **`wasICESuccessful`**: “Yes,” “No,” or “Unknown.”  
- **`locationReference`**: “ZIP,” “ADDRESS,” “INTERSECTION,” or “NONE.”  
- **`sourceOfInfo`**: “NewsArticle,” “PersonalObservation,” etc.  
- **`upvoteCount`, `downvoteCount`, `flagCount`**: Community feedback.  
- **`createdAt`, `updatedAt`**: Timestamps set by the server.

**Firestore Rules** (`firestore.rules`)  
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /raidReports/{docId} {
      allow read: if true;       // or restrict if needed
      allow write: if false;     // block direct writes from the client
    }
  }
}
```
Because we rely on **Admin SDK** calls from **Cloud Functions** to write data, these rules block direct client writes. This ensures **strict validation** is always enforced.

---

## 8. Indexing

- **`firestore.indexes.json`** can hold **composite indexes** if you do complex queries (e.g., filter by multiple fields).  
- For single-field queries or basic usage, you typically **don’t** need extra indexes.  
- If Firestore prompts you for an index, add the snippet from the console to `firestore.indexes.json`, then deploy with:
  ```bash
  firebase deploy --only firestore:indexes
  ```

---

## 9. Usage

### Calling the `createRaidReport` Function

From your frontend (web, iOS, Android), use the Firebase client SDK to invoke the callable function:

```js
import { getFunctions, httpsCallable } from "firebase/functions";

async function submitRaidReport() {
  const functions = getFunctions();
  const createRaidReport = httpsCallable(functions, "createRaidReport");

  try {
    const result = await createRaidReport({
      lat: 33.7490,
      lng: -84.3880,
      geohash: "abcd1234",
      dateOfRaid: "2025-01-16T10:00:00.000Z",
      tacticsUsed: ["Surveillance"],
      raidLocationCategory: "Home",
      detailLocation: "CarStop",
      wasICESuccessful: "Unknown",
      locationReference: "ZIP",
      sourceOfInfo: "PersonalObservation"
    });
    console.log("Created Raid Report:", result.data);
  } catch (error) {
    console.error("Error creating raid report:", error);
  }
}
```

### Reading Data

Depending on your Firestore rules, you can do a simple snapshot listener or query. For example, to list all reports:

```js
import { getFirestore, collection, getDocs } from "firebase/firestore";

async function fetchRaidReports() {
  const db = getFirestore();
  const reportsColl = collection(db, "raidReports");
  const snap = await getDocs(reportsColl);
  snap.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
}
```

---

## 10. Contributing

We welcome **community contributions** that reinforce our mission of **empowering the working class** and **protecting** immigrants or other vulnerable groups. When contributing:

1. Follow the **no freeform text** policy to keep data secure and consistent.  
2. Maintain enumerations in `config/constants.ts`—don’t introduce new fields or text without thoughtful review.  
3. Write unit tests or integration tests if adding new Cloud Functions.  
4. Document your changes thoroughly in pull requests.

---

## 11. License

This example project is made available under an **MIT License** (or whichever license you choose). See the [LICENSE](./LICENSE) file for details.

---

**Join us** in building a fairer, more transparent world, where everyone can stay safe and informed without sacrificing their privacy.