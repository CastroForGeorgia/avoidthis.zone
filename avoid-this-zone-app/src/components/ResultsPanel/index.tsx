import React, { Key, useContext, useEffect, useState } from "react";
import { Table, Spin, Alert, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { DatePicker } from "antd/lib";
import { AppDataContext } from "../../providers/AppDataContextProvider";
import { RaidReportFirestoreData } from "../../firebase/firestore";
const { RangePicker } = DatePicker;

const RaidReportTable: React.FC = () => {
  const {
    reports,
    loadingReports,
    reportsError,
    enumData,
    loadingEnums,
    enumError,
  } = useContext(AppDataContext);

  const { t } = useTranslation();

  // Helper for reading out localized or unknown
  const getDisplayValue = (value: any, enumKey: string) =>
    value ? t(`${enumKey}.${value}`) : t("Common.unknown");

  const dataSource = reports.map((report) => ({
    key: report.id,
    ...report,
  }));

  // Helper to convert enum values into Table filters
  const createFilters = (enumKey: string) => {
    const values = enumData[enumKey] || [];
    return values.map((val) => ({
      text: t(`Enums.${enumKey}.${val}`),
      value: val,
    }));
  };


  // Helper function to display date/time
  const formatDateTime = (timestamp?: any) =>
    timestamp ? timestamp.toDate().toLocaleString() : t("Common.unknown");

  // 3) Define columns with filters from your enumData
  const columns: ColumnsType<RaidReportFirestoreData> = [
    {
      title: t("ReportModal.labels.sourceOfInfo"),
      dataIndex: "sourceOfInfo",
      key: "sourceOfInfo",
      filters: createFilters("ALLOWED_SOURCE_OF_INFO"),
      onFilter: (value, record) => record.sourceOfInfo === (value as string),
      render: (value: string) => getDisplayValue(value, "Enums.ALLOWED_SOURCE_OF_INFO"),
    },
    {
      title: t("ReportModal.labels.tactics"),
      dataIndex: "tacticsUsed",
      key: "tacticsUsed",
      filters: createFilters("ALLOWED_TACTICS"),
      onFilter: (value, record) => record.tacticsUsed.includes(value as string),
      render: (values: string[]) =>
        values && values.length
          ? values.map((val) => t(`Enums.ALLOWED_TACTICS.${val}`)).join(", ")
          : t("Common.unknown"),
    },
    {
      title: t("ReportModal.labels.locationReference"),
      dataIndex: "locationReference",
      key: "locationReference",
      filters: createFilters("ALLOWED_LOCATION_REFERENCE"),
      onFilter: (value, record) => record.locationReference === (value as string),
      render: (value: string) => getDisplayValue(value, "Enums.ALLOWED_LOCATION_REFERENCE"),
    },
    {
      title: t("ReportModal.labels.raidLocationCategory"),
      dataIndex: "raidLocationCategory",
      key: "raidLocationCategory",
      filters: createFilters("ALLOWED_RAID_LOCATION_CATEGORY"),
      onFilter: (value, record) => record.raidLocationCategory === (value as string),
      render: (value: string) => getDisplayValue(value, "Enums.ALLOWED_RAID_LOCATION_CATEGORY"),
    },
    {
      title: t("ReportModal.labels.detailLocation"),
      dataIndex: "detailLocation",
      key: "detailLocation",
      filters: createFilters("ALLOWED_DETAIL_LOCATION"),
      onFilter: (value, record) => record.detailLocation === (value as string),
      render: (value: string) => getDisplayValue(value, "Enums.ALLOWED_DETAIL_LOCATION"),
    },
    {
      title: t("ReportModal.labels.wasSuccessful"),
      dataIndex: "wasSuccessful",
      key: "wasSuccessful",
      filters: createFilters("ALLOWED_WAS_SUCCESSFUL"),
      onFilter: (value, record) => record.wasSuccessful === (value as string),
      render: (value: string) => getDisplayValue(value, "Enums.ALLOWED_WAS_SUCCESSFUL"),
    },
    {
      title: t("Common.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: any) => formatDateTime(value),

      // A) Custom filter dropdown for date range
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        // selectedKeys[0] will store our [startMoment, endMoment]
        const currentRange = (selectedKeys[0] as any) || [];
        return (
          <div style={{ padding: 8 }}>
            <RangePicker
              // Set the current selection
              value={currentRange}
              onChange={(dates) => {
                // If user clears the range, set an empty array
                setSelectedKeys(dates ? ([dates] as unknown as Key[]) : []);
              }}
              style={{ marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => confirm()}
                size="small"
                style={{ width: 90 }}
              >
                {t("Common.filter")}
              </Button>
              <Button
                onClick={() => {
                  clearFilters && clearFilters();
                }}
                size="small"
                style={{ width: 90 }}
              >
                {t("Common.reset")}
              </Button>
            </Space>
          </div>
        );
      },

      // B) Force the filter dropdown to stay open or close
      filterIcon: (filtered) => (
        <span style={{ color: filtered ? "#1890ff" : undefined }}>
          &#128197;{/*Calendar icon placeholder*/}
        </span>
      ),
      onFilterDropdownVisibleChange: (visible) => {
        // If you need to focus something when dropdown is opened, do it here
      },

      // C) The filtering logic
      onFilter: (value, record) => {
        // "value" here will be our selectedKeys[0]: [startMoment, endMoment]
        const [start, end] = (value as any) || [];
        if (!start || !end) {
          // If no range is selected, show all
          return true;
        }
        const recordDate = record.createdAt?.toDate();
        if (!recordDate) return false;
        // Compare recordDate with the chosen [start, end]
        return recordDate >= start.toDate() && recordDate <= end.toDate();
      },
    },
  ];

  // 4) Handle loading + error states
  if (loadingEnums || loadingReports) {
    return (
      <div className="results-content">
        <Spin tip={t("Common.loadingMessage")} />
      </div>
    );
  }

  if (enumError || reportsError) {
    return (
      <div className="results-content">
        <Alert
          message={t("Common.errorOccurred")}
          description={enumError || reportsError}
          type="error"
          showIcon
          closable
        />
      </div>
    );
  }

  // 5) Render the table with all filters from your enum data
  return (
    <div className="raid-report-table">
      <Table<RaidReportFirestoreData>
        columns={columns}
        dataSource={dataSource}
        onChange={(pagination, filters, sorter) => {
          console.log("Table changed:", { pagination, filters, sorter });
        }}
      />
    </div>
  );
};

export default RaidReportTable;
