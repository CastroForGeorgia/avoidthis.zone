import React, { Key, useContext } from "react";
import { Table, Spin, Alert, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { DatePicker } from "antd/lib";
import { AppDataContext, ReportQueryFilter } from "../../providers/AppDataContextProvider";
import { RaidReportFirestoreData } from "../../firebase/firestore";
import { useMap } from "@terrestris/react-util";
import { fromLonLat } from "ol/proj";

const { RangePicker } = DatePicker;

const RaidReportTable: React.FC = () => {
  const {
    reports,
    loadingReports,
    reportsError,
    enumData,
    loadingEnums,
    enumError,
    setReportQueryFilters,
  } = useContext(AppDataContext);

  const { t } = useTranslation();
  const map = useMap();

  // Helper to display a localized value or a default unknown message.
  const getDisplayValue = (value: any, enumKey: string) =>
    value ? t(`${enumKey}.${value}`) : t("Common.unknown");

  // Prepare the dataSource for the table.
  const dataSource = reports.map((report) => ({
    key: report.id,
    ...report,
  }));

  // Helper to convert enum values into Ant Design Table filter options.
  const createFilters = (enumKey: string) => {
    const values = enumData[enumKey] || [];
    return values.map((val) => ({
      text: t(`Enums.${enumKey}.${val}`),
      value: val,
    }));
  };

  // Helper to format date/time values.
  const formatDateTime = (timestamp?: any) =>
    timestamp ? timestamp.toDate().toLocaleString() : t("Common.unknown");

  /**
   * handleNavigation
   *
   * Navigates the map view to the location specified in the report.
   * This is another way we empower everyday people—by turning data points
   * into real locations where the system is failing our communities.
   *
   * @param report - The report object containing the coordinates.
   */
  const handleNavigation = (report: RaidReportFirestoreData) => {
    if (report.coordinates && map) {
      // Assuming coordinates are stored as [longitude, latitude]
      const { geopoint } = report.coordinates[0];
      map.getView().animate({
        center: fromLonLat([geopoint.latitude, geopoint.longitude]),
        zoom: 14, // Adjust zoom level as needed.
        duration: 1000,
      });
    } else {
      console.warn("Coordinates not available for this report.");
    }
  };

  /**
   * handleTableChange
   *
   * Every time the table’s filters are changed, we translate the selected filters
   * into Firestore query filters and update our global state. This ensures that our query
   * always reflects the will of the people—not the hidden interests of a corrupt system.
   *
   * @param pagination - Pagination info (unused here).
   * @param filters - The filters selected on the table.
   * @param sorter - Sorting info (unused here).
   */
  const handleTableChange = (
    pagination: any,
    filters: Record<string, (string | any)[] | null>,
    sorter: any
  ) => {
    const newQueryFilters: ReportQueryFilter[] = [];

    if (filters.sourceOfInfo && filters.sourceOfInfo.length > 0) {
      newQueryFilters.push({
        field: "sourceOfInfo",
        operator: "==",
        value: filters.sourceOfInfo[0],
      });
    }
    if (filters.tacticsUsed && filters.tacticsUsed.length > 0) {
      newQueryFilters.push({
        field: "tacticsUsed",
        operator: "array-contains",
        value: filters.tacticsUsed[0],
      });
    }
    if (filters.locationReference && filters.locationReference.length > 0) {
      newQueryFilters.push({
        field: "locationReference",
        operator: "==",
        value: filters.locationReference[0],
      });
    }
    if (filters.raidLocationCategory && filters.raidLocationCategory.length > 0) {
      newQueryFilters.push({
        field: "raidLocationCategory",
        operator: "==",
        value: filters.raidLocationCategory[0],
      });
    }
    if (filters.detailLocation && filters.detailLocation.length > 0) {
      newQueryFilters.push({
        field: "detailLocation",
        operator: "==",
        value: filters.detailLocation[0],
      });
    }
    if (filters.wasSuccessful && filters.wasSuccessful.length > 0) {
      // Convert the filter to a boolean if necessary.
      const boolValue =
        filters.wasSuccessful[0] === "true" || filters.wasSuccessful[0] === true;
      newQueryFilters.push({
        field: "wasSuccessful",
        operator: "==",
        value: boolValue,
      });
    }
    if (filters.createdAt && filters.createdAt.length > 0) {
      // The createdAt filter returns an array containing the selected date range.
      const range = filters.createdAt[0];
      if (range && Array.isArray(range) && range.length === 2) {
        newQueryFilters.push({
          field: "createdAt",
          operator: ">=",
          value: range[0].toDate(),
        });
        newQueryFilters.push({
          field: "createdAt",
          operator: "<=",
          value: range[1].toDate(),
        });
      }
    }

    // Update our global query filters—this is how we keep power in the hands of the people.
    setReportQueryFilters(newQueryFilters);
  };

  // Define table columns with filters based on enumData.
  const columns: ColumnsType<RaidReportFirestoreData> = [
    {
      title: t("Common.navigate"),
      key: "navigate",
      render: (_, record) => (
        <Button type="link" onClick={() => handleNavigation(record)}>
          {t("Common.viewOnMap")}
        </Button>
      ),
    },
    {
      title: t("ReportModal.labels.sourceOfInfo"),
      dataIndex: "sourceOfInfo",
      key: "sourceOfInfo",
      filters: createFilters("ALLOWED_SOURCE_OF_INFO"),
      onFilter: (value, record) => record.sourceOfInfo === (value as string),
      render: (value: string) =>
        getDisplayValue(value, "Enums.ALLOWED_SOURCE_OF_INFO"),
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
      onFilter: (value, record) =>
        record.locationReference === (value as string),
      render: (value: string) =>
        getDisplayValue(value, "Enums.ALLOWED_LOCATION_REFERENCE"),
    },
    {
      title: t("ReportModal.labels.raidLocationCategory"),
      dataIndex: "raidLocationCategory",
      key: "raidLocationCategory",
      filters: createFilters("ALLOWED_RAID_LOCATION_CATEGORY"),
      onFilter: (value, record) =>
        record.raidLocationCategory === (value as string),
      render: (value: string) =>
        getDisplayValue(value, "Enums.ALLOWED_RAID_LOCATION_CATEGORY"),
    },
    {
      title: t("ReportModal.labels.detailLocation"),
      dataIndex: "detailLocation",
      key: "detailLocation",
      filters: createFilters("ALLOWED_DETAIL_LOCATION"),
      onFilter: (value, record) =>
        record.detailLocation === (value as string),
      render: (value: string) =>
        getDisplayValue(value, "Enums.ALLOWED_DETAIL_LOCATION"),
    },
    {
      title: t("ReportModal.labels.wasSuccessful"),
      dataIndex: "wasSuccessful",
      key: "wasSuccessful",
      filters: createFilters("ALLOWED_WAS_SUCCESSFUL"),
      onFilter: (value, record) =>
        String(record.wasSuccessful) === (value as string),
      render: (value: string) =>
        getDisplayValue(value, "Enums.ALLOWED_WAS_SUCCESSFUL"),
    },
    {
      title: t("Common.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: any) => formatDateTime(value),
      // Custom filter dropdown for date range.
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        const currentRange = (selectedKeys[0] as any) || [];
        return (
          <div style={{ padding: 8 }}>
            <RangePicker
              value={currentRange}
              onChange={(dates) => {
                // If dates are cleared, set an empty array.
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
      filterIcon: (filtered) => (
        <span style={{ color: filtered ? "#1890ff" : undefined }}>
          &#128197;
        </span>
      ),
      onFilterDropdownVisibleChange: (visible) => {
        // Optional: focus handling when dropdown opens.
      },
      onFilter: (value, record) => {
        // "value" here is the selected date range.
        const [start, end] = (value as any) || [];
        if (!start || !end) {
          return true;
        }
        const recordDate = record.createdAt?.toDate();
        if (!recordDate) return false;
        return recordDate >= start.toDate() && recordDate <= end.toDate();
      },
    },
  ];

  // Display loading or error states if needed.
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

  // Render the table. The onChange callback ensures that any filter change
  // immediately updates the Firestore query—giving power back to the people.
  return (
    <div className="raid-report-table">
      <Table<RaidReportFirestoreData>
        columns={columns}
        dataSource={dataSource}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default RaidReportTable;
