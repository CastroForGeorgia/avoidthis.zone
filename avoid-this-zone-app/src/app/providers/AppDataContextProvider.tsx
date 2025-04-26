/**
 * AppDataContextProvider.tsx
 * ---------------------------------------------------------------------------
 * Central context for raid reports, enum metadata, query filters, and
 * heat‑map coordinates. Components can subscribe via `useContext(AppDataContext)`.
 */

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction
} from 'react';
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  where
} from 'firebase/firestore';
import {
  db,
  fetchEnumValues,
  RaidReportFirestoreData
} from '../../backend/firestore';
import { useTranslation } from 'react-i18next';

/* -------------------------------------------------------------------------
   Types
---------------------------------------------------------------------------*/

export interface ReportQueryFilter {
  field: string;
  operator: '==' | '<' | '>' | '<=' | '>=' | 'array-contains';
  value: any;
}

/** Simple point for the OL heat‑map layer */
export interface HeatMapPoint {
  lon: number;
  lat: number;
  weight?: number;
}

interface AppDataContextProps {
  /* Raid reports */
  reports: RaidReportFirestoreData[];
  loadingReports: boolean;
  reportsError: string | null;

  /* Enumerated option metadata (e.g. form selects) */
  enumData: Record<string, string[]>;
  loadingEnums: boolean;
  enumError: string | null;

  /* Dynamic Firestore filters for raidReports */
  reportQueryFilters: ReportQueryFilter[];
  setReportQueryFilters: Dispatch<SetStateAction<ReportQueryFilter[]>>;

  /* Heat‑map points shared across the app */
  heatMapPoints: HeatMapPoint[];
  setHeatMapPoints: Dispatch<SetStateAction<HeatMapPoint[]>>;
  addHeatMapPoint: (pt: HeatMapPoint) => void;
  clearHeatMapPoints: () => void;
}

/* -------------------------------------------------------------------------
   Context + default values
---------------------------------------------------------------------------*/
export const AppDataContextProvider = createContext<AppDataContextProps>({
  reports: [],
  loadingReports: true,
  reportsError: null,

  enumData: {},
  loadingEnums: true,
  enumError: null,

  reportQueryFilters: [],
  setReportQueryFilters: () => {},

  heatMapPoints: [],
  setHeatMapPoints: () => {},
  addHeatMapPoint: () => {},
  clearHeatMapPoints: () => {}
});

interface AppDataProviderProps {
  children: ReactNode;
}

/* -------------------------------------------------------------------------
   Provider
---------------------------------------------------------------------------*/
export const AppDataProvider: React.FC<AppDataProviderProps> = ({
  children
}) => {
  /* ----- Raid reports ----- */
  const [reports, setReports] = useState<RaidReportFirestoreData[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);

  /* ----- Enum metadata ----- */
  const [enumData, setEnumData] = useState<Record<string, string[]>>({});
  const [loadingEnums, setLoadingEnums] = useState(true);
  const [enumError, setEnumError] = useState<string | null>(null);

  /* ----- Firestore query filters ----- */
  const [reportQueryFilters, setReportQueryFilters] = useState<
    ReportQueryFilter[]
  >([]);

  /* ----- Heat‑map state ----- */
  const [heatMapPoints, setHeatMapPoints] = useState<HeatMapPoint[]>([]);
  const addHeatMapPoint = (pt: HeatMapPoint) =>
    setHeatMapPoints((prev) => [...prev, pt]);
  const clearHeatMapPoints = () => setHeatMapPoints([]);

  const { t } = useTranslation();

  /* -----------------------------------------------------------------------
     A) Live raidReports listener (honours dynamic filters)
  ------------------------------------------------------------------------*/
  useEffect(() => {
    const raidReportsCollection = collection(db, 'raidReports');

    const queryConstraints = [
      orderBy('createdAt', 'desc'),
      ...reportQueryFilters.map((f) => where(f.field, f.operator, f.value))
    ];

    const reportsQuery = query(raidReportsCollection, ...queryConstraints);

    const unsubscribe = onSnapshot(
      reportsQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const fetched: RaidReportFirestoreData[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as RaidReportFirestoreData;
          fetched.push({ ...data, id: doc.id });
        });
        setReports(fetched);
        setLoadingReports(false);
      },
      (err) => {
        console.error('Error fetching raid reports:', err);
        setReportsError(t('Common.errorOccurred'));
        setLoadingReports(false);
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, JSON.stringify(reportQueryFilters)]);

  /* -----------------------------------------------------------------------
     B) Enum metadata
  ------------------------------------------------------------------------*/
  useEffect(() => {
    (async () => {
      setLoadingEnums(true);
      try {
        const data = await fetchEnumValues();
        if (!data) {
          setEnumError(t('SideDrawer.errorMessages.failedToLoadData'));
        } else {
          setEnumData(data);
        }
      } catch (err) {
        console.error('Error fetching enums:', err);
        setEnumError(t('SideDrawer.errorMessages.genericError'));
      } finally {
        setLoadingEnums(false);
      }
    })();
  }, [t]);

  /* -----------------------------------------------------------------------
     Compose context value
  ------------------------------------------------------------------------*/
  const value: AppDataContextProps = {
    reports,
    loadingReports,
    reportsError,

    enumData,
    loadingEnums,
    enumError,

    reportQueryFilters,
    setReportQueryFilters,

    heatMapPoints,
    setHeatMapPoints,
    addHeatMapPoint,
    clearHeatMapPoints
  };

  return (
    <AppDataContextProvider.Provider value={value}>{children}</AppDataContextProvider.Provider>
  );
};
