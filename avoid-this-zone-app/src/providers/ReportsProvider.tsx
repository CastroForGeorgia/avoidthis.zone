import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
} from "firebase/firestore";
import { db, RaidReportFirestoreData } from "../firebase/firestore"; // adjust import paths

// 1) Define the shape of our context
interface ReportsContextProps {
  reports: RaidReportFirestoreData[];
  loading: boolean;
  error: string | null;
}

// 2) Create context with default values
export const ReportsContext = createContext<ReportsContextProps>({
  reports: [],
  loading: true,
  error: null,
});

interface ReportsProviderProps {
  children: ReactNode;
}

// 3) Provider component to fetch data once, share across app
export const ReportsProvider: React.FC<ReportsProviderProps> = ({ children }) => {
  const [reports, setReports] = useState<RaidReportFirestoreData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raidReportsCollection = collection(db, "raidReports");
    const reportsQuery = query(raidReportsCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      reportsQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const fetchedReports: RaidReportFirestoreData[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as RaidReportFirestoreData;
          fetchedReports.push({ ...data, id: doc.id });
        });
        setReports(fetchedReports);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching raid reports:", err);
        setError("Failed to load raid reports.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 4) Pass the data and status to the context
  const value: ReportsContextProps = {
    reports,
    loading,
    error,
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};
