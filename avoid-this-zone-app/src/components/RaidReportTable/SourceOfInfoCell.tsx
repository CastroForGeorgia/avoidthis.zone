// src/components/RaidReportTable/SourceOfInfoCell.tsx
import React from "react";
import { Space, Tag, Button } from "antd";
import { RaidReportFirestoreData } from "../../firebase/firestore";
import { getTagColor } from "../Helpers";

interface SourceOfInfoCellProps {
    value: string;
    record: RaidReportFirestoreData;
    onNavigate: (report: RaidReportFirestoreData) => void;
    t: any;
}

const SourceOfInfoCell: React.FC<SourceOfInfoCellProps> = ({
    value,
    record,
    onNavigate,
    t,
}) => {
    const displayValue = value
        ? t(`Enums.ALLOWED_SOURCE_OF_INFO.${value}`)
        : t("Common.unknown");

    return (
        <Space direction="vertical">
            <Tag color={getTagColor("ALLOWED_SOURCE_OF_INFO", value)} key={value}>
                {displayValue}
            </Tag>
            <Button type="link" onClick={() => onNavigate(record)}>
                {t("Common.viewOnMap")}
            </Button>
        </Space>
    );
};

export default SourceOfInfoCell;
