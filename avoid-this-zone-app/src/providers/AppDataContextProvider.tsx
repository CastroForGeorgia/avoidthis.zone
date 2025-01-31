import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
} from "firebase/firestore";
import { db, fetchEnumValues, RaidReportFirestoreData } from "../firebase/firestore";
import { useTranslation } from "react-i18next";

interface AppDataContextProps {
  reports: RaidReportFirestoreData[];
  loadingReports: boolean;
  reportsError: string | null;
  enumData: Record<string, string[]>;
  loadingEnums: boolean;
  enumError: string | null;
}

export const AppDataContext = createContext<AppDataContextProps>({
  reports: [],
  loadingReports: true,
  reportsError: null,
  enumData: {},
  loadingEnums: true,
  enumError: null,
});

interface AppDataProviderProps {
  children: ReactNode;
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  const [reports, setReports] = useState<RaidReportFirestoreData[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);

  const [enumData, setEnumData] = useState<Record<string, string[]>>({});
  const [loadingEnums, setLoadingEnums] = useState(true);
  const [enumError, setEnumError] = useState<string | null>(null);

  const { t } = useTranslation();

  // A) Load Reports
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
        setLoadingReports(false);
      },
      (err) => {
        console.error("Error fetching raid reports:", err);
        setReportsError(t("Common.errorOccurred"));
        setLoadingReports(false);
      }
    );

    return () => unsubscribe();
  }, [t]);

  // B) Load Enums
  useEffect(() => {
    const loadEnums = async () => {
      setLoadingEnums(true);
      try {
        const data = await fetchEnumValues();
        if (!data) {
          setEnumError(t("SideDrawer.errorMessages.failedToLoadData"));
        } else {
          setEnumData(data);
        }
      } catch (error) {
        console.error("Error fetching enums:", error);
        setEnumError(t("SideDrawer.errorMessages.genericError"));
      } finally {
        setLoadingEnums(false);
      }
    };
    loadEnums();
  }, [t]);

  // C) Provide everything
  const value: AppDataContextProps = {
    reports,
    loadingReports,
    reportsError,
    enumData,
    loadingEnums,
    enumError,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};
