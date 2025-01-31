import React, { useEffect, useState } from "react";
import { collection, DocumentData, onSnapshot, orderBy, query, QuerySnapshot } from "firebase/firestore";
import { db, RaidReportFirestoreData } from "../../firebase/firestore";
import { Card, Spin, Alert } from "antd";
import { useTranslation } from "react-i18next";

const RaidReportCard: React.FC = () => {
  const [reports, setReports] = useState<RaidReportFirestoreData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

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
        setError(t("Common.errorOccurred"));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [t]);

  const handleVote = (id: string, type: "upvote" | "downvote") => {
    console.log(`${t("ReportModal.labels.tactics")} ${type} on report with ID: ${id}`);
  };

  const getDisplayValue = (value: any, enumKey: string) =>
    value ? t(`${enumKey}.${value}`) : t("Common.unknown");

  if (loading) {
    return (
      <div className="results-content">
        <Spin tip={t("Common.loadingMessage")} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-content">
        <Alert message={t("Common.errorOccurred")} description={error} type="error" showIcon closable />
      </div>
    );
  }

  return (
    <div className="raid-report-list">
      {reports.map((report) => (
        <Card
          key={report.id}
          title={`${getDisplayValue(report.sourceOfInfo, "Enums.ALLOWED_SOURCE_OF_INFO")}`} // Source of Info as title
          extra={<span>{report.createdAt.toDate().toLocaleDateString()}</span>}
          style={{ marginBottom: "16px" }}
          bordered
        >
          <p>
            <strong>{t("ReportModal.labels.tactics")}:</strong>{" "}
            {report.tacticsUsed.length > 0
              ? report.tacticsUsed.map((tactic) => t(`Enums.ALLOWED_TACTICS.${tactic}`)).join(", ")
              : t("Common.unknown")}
          </p>
          <p>
            <strong>{t("ReportModal.labels.locationReference")}:</strong>{" "}
            {getDisplayValue(report.locationReference, "Enums.ALLOWED_LOCATION_REFERENCE")}
          </p>
          <p>
            <strong>{t("ReportModal.labels.raidLocationCategory")}:</strong>{" "}
            {getDisplayValue(report.raidLocationCategory, "Enums.ALLOWED_RAID_LOCATION_CATEGORY")}
          </p>
          <p>
            <strong>{t("ReportModal.labels.detailLocation")}:</strong>{" "}
            {getDisplayValue(report.detailLocation, "Enums.ALLOWED_DETAIL_LOCATION")}
          </p>
          <p>
            <strong>{t("ReportModal.labels.wasSuccessful")}:</strong>{" "}
            {getDisplayValue(report.wasSuccessful, "Enums.ALLOWED_WAS_SUCCESSFUL")}
          </p>

          {/* If sourceOfInfoUrl exists, show it as a clickable link */}
          {/* {report.sourceOfInfoUrl && (
            <p>
              <strong>{t("Common.viewDetails")}:</strong>{" "}
              <a
                href={report.sourceOfInfoUrl.startsWith("http") ? report.sourceOfInfoUrl : `https://${report.sourceOfInfoUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: "8px" }}
              >
                {t("Common.viewDetails")}
              </a>
            </p>
          )} */}
        </Card>
      ))}
    </div>
  );
};

export default RaidReportCard;
