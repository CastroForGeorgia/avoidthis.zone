// src/components/RaidReportTable/RaidReportTable.tsx
import React, { useContext } from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { AppDataContext, ReportQueryFilter } from "../../providers/AppDataContextProvider";
import { RaidReportFirestoreData } from "../../firebase/firestore";
import { useMap } from "@terrestris/react-util";
import { fromLonLat } from "ol/proj";
import { Timestamp } from "firebase/firestore";
import LoadingErrorWrapper from "../LoadingErrorWrapper";
import SourceOfInfoCell from "./SourceOfInfoCell";
import TacticsCell from "./TacticsCell";
import EnumTagCell from "./EnumTagCell";
import DateRangeFilterDropdown from "./DateRangeFilterDropdown";

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

    // Helper to create filter options based on enum values.
    const createFilters = (enumKey: string) => {
        const values = enumData[enumKey] || [];
        return values.map((val: string) => ({
            text: t(`Enums.${enumKey}.${val}`),
            value: val,
        }));
    };

    // Format date/time values.
    const formatDateTime = (timestamp?: any) =>
        timestamp ? timestamp.toDate().toLocaleString() : t("Common.unknown");

    // Handle map navigation for a given report.
    const handleNavigation = (report: RaidReportFirestoreData) => {
        if (report.coordinates && map) {
            // Assuming coordinates are stored as [longitude, latitude]
            const { geopoint } = report.coordinates[0];
            map.getView().animate({
                center: fromLonLat([geopoint.latitude, geopoint.longitude]),
                zoom: 14,
                duration: 1000,
            });
        } else {
            console.warn("Coordinates not available for this report.");
        }
    };

    // Translate table filter changes into Firestore query filters.
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
            newQueryFilters.push({
                field: "wasSuccessful",
                operator: "==",
                value: filters.wasSuccessful[0],
            });
        }
        if (filters.createdAt && filters.createdAt.length > 0) {
            // The createdAt filter returns an array containing the selected date range.
            const range = filters.createdAt[0];
            if (range && Array.isArray(range) && range.length === 2) {
                // Convert the dates to UTC before setting the boundaries.
                const startOfDayUTC = range[0].startOf("day").toDate();
                const endOfDayUTC = range[1].endOf("day").toDate();

                newQueryFilters.push({
                    field: "createdAt",
                    operator: ">=",
                    value: Timestamp.fromDate(startOfDayUTC),
                });
                newQueryFilters.push({
                    field: "createdAt",
                    operator: "<=",
                    value: Timestamp.fromDate(endOfDayUTC),
                });
            }
        }

        // Update our global query filters—keeping power in the hands of the people.
        setReportQueryFilters(newQueryFilters);
    };

    // Prepare the data source for the table.
    const dataSource = reports.map((report) => ({
        key: report.id,
        ...report,
    }));

    // Define table columns using our smaller, focused components.
    const columns: ColumnsType<RaidReportFirestoreData> = [
        {
            title: t("ReportModal.labels.sourceOfInfo"),
            dataIndex: "sourceOfInfo",
            key: "sourceOfInfo",
            filters: createFilters("ALLOWED_SOURCE_OF_INFO"),
            onFilter: (value, record) => record.sourceOfInfo === (value as string),
            render: (value: string, record: RaidReportFirestoreData) => (
                <SourceOfInfoCell
                    value={value}
                    record={record}
                    onNavigate={handleNavigation}
                    t={t}
                />
            ),
        },
        {
            title: t("ReportModal.labels.tactics"),
            dataIndex: "tacticsUsed",
            key: "tacticsUsed",
            filters: createFilters("ALLOWED_TACTICS"),
            onFilter: (value, record) =>
                record.tacticsUsed.includes(value as string),
            render: (values: string[]) => <TacticsCell values={values} t={t} />,
        },
        {
            title: t("ReportModal.labels.locationReference"),
            dataIndex: "locationReference",
            key: "locationReference",
            filters: createFilters("ALLOWED_LOCATION_REFERENCE"),
            onFilter: (value, record) =>
                record.locationReference === (value as string),
            render: (value: string) => (
                <EnumTagCell
                    value={value}
                    enumKey="ALLOWED_LOCATION_REFERENCE"
                    t={t}
                />
            ),
        },
        {
            title: t("ReportModal.labels.raidLocationCategory"),
            dataIndex: "raidLocationCategory",
            key: "raidLocationCategory",
            filters: createFilters("ALLOWED_RAID_LOCATION_CATEGORY"),
            onFilter: (value, record) =>
                record.raidLocationCategory === (value as string),
            render: (value: string) => (
                <EnumTagCell
                    value={value}
                    enumKey="ALLOWED_RAID_LOCATION_CATEGORY"
                    t={t}
                />
            ),
        },
        {
            title: t("ReportModal.labels.detailLocation"),
            dataIndex: "detailLocation",
            key: "detailLocation",
            filters: createFilters("ALLOWED_DETAIL_LOCATION"),
            onFilter: (value, record) =>
                record.detailLocation === (value as string),
            render: (value: string) => (
                <EnumTagCell value={value} enumKey="ALLOWED_DETAIL_LOCATION" t={t} />
            ),
        },
        {
            title: t("ReportModal.labels.wasSuccessful"),
            dataIndex: "wasSuccessful",
            key: "wasSuccessful",
            filters: createFilters("ALLOWED_WAS_SUCCESSFUL"),
            onFilter: (value, record) =>
                String(record.wasSuccessful) === (value as string),
            render: (value: string) => (
                <EnumTagCell
                    value={value}
                    enumKey="ALLOWED_WAS_SUCCESSFUL"
                    t={t}
                />
            ),
        },
        {
            title: t("Common.createdAt"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (value: any) => (
                <Tag color="default">{formatDateTime(value)}</Tag>
            ),
            filterDropdown: (props) => <DateRangeFilterDropdown {...props} t={t} />,
            filterIcon: (filtered) => (
                <span style={{ color: filtered ? "#1890ff" : undefined }}>
                    &#128197;
                </span>
            ),
        },
    ];

    return (
        <LoadingErrorWrapper
            loading={loadingEnums || loadingReports}
            error={enumError || reportsError}
            loadingMessage={t("Common.loadingMessage")}
            errorMessage={t("Common.errorOccurred")}
        >
            <div className="raid-report-table">
                <Table<RaidReportFirestoreData>
                    columns={columns}
                    dataSource={dataSource}
                    onChange={handleTableChange}
                />
            </div>
        </LoadingErrorWrapper>
    );
};

export default RaidReportTable;
