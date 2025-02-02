// src/components/RaidReportTable/EnumTagCell.tsx
import React from "react";
import { Tag } from "antd";
import { getTagColor } from "../Helpers";

interface EnumTagCellProps {
    value: string;
    enumKey: string; // For example, "ALLOWED_LOCATION_REFERENCE"
    t: any;
}

const EnumTagCell: React.FC<EnumTagCellProps> = ({ value, enumKey, t }) => {
    const displayValue = value ? t(`Enums.${enumKey}.${value}`) : t("Common.unknown");
    return (
        <Tag color={getTagColor(enumKey, value)} key={value}>
            {displayValue}
        </Tag>
    );
};

export default EnumTagCell;
