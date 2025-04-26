import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { db, fetchEnumValues, RaidReportFirestoreData } from "../../backend/firestore";
import { useTranslation } from "react-i18next";

// Define a filter type for report queries
export interface ReportQueryFilter {
  field: string;
  operator: "==" | "<" | ">" | "<=" | ">=" | "array-contains";
  value: any;
}

interface AppDataContextProps {
  reports: RaidReportFirestoreData[];
  loadingReports: boolean;
  reportsError: string | null;
  enumData: Record<string, string[]>;
  loadingEnums: boolean;
  enumError: string | null;
  // Now include the filters in the context so all components can access them.
  reportQueryFilters: ReportQueryFilter[];
  setReportQueryFilters: React.Dispatch<React.SetStateAction<ReportQueryFilter[]>>;
}

export const AppDataContext = createContext<AppDataContextProps>({
  reports: [],
  loadingReports: true,
  reportsError: null,
  enumData: {},
  loadingEnums: true,
  enumError: null,
  reportQueryFilters: [],
  setReportQueryFilters: () => {},
});

interface AppDataProviderProps {
  children: ReactNode;
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({
  children,
}) => {
  const [reports, setReports] = useState<RaidReportFirestoreData[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);

  const [enumData, setEnumData] = useState<Record<string, string[]>>({});
  const [loadingEnums, setLoadingEnums] = useState(true);
  const [enumError, setEnumError] = useState<string | null>(null);

  // Manage the query filters in state.
  const [reportQueryFilters, setReportQueryFilters] = useState<ReportQueryFilter[]>(
    []
  );

  const { t } = useTranslation();

  // A) Load Reports with dynamic filters
  useEffect(() => {
    const raidReportsCollection = collection(db, "raidReports");

    // Build query constraints: order by createdAt and apply dynamic filters.
    const queryConstraints = [
      orderBy("createdAt", "desc"),
      ...reportQueryFilters.map((filter) =>
        where(filter.field, filter.operator, filter.value)
      ),
    ];

    const reportsQuery = query(raidReportsCollection, ...queryConstraints);

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

    // Use JSON.stringify to ensure the effect only runs when the actual filter values change.
    return () => unsubscribe();
  }, [t, JSON.stringify(reportQueryFilters)]);

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

  // C) Provide everything through context—including our filter state—to ensure a unified, transparent system.
  const value: AppDataContextProps = {
    reports,
    loadingReports,
    reportsError,
    enumData,
    loadingEnums,
    enumError,
    reportQueryFilters,
    setReportQueryFilters,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};
