// src/components/RaidReportTable/TacticsCell.tsx
import React from "react";
import { Tag, Space, Popover } from "antd";
import { getTagColor } from "../Helpers";

interface TacticsCellProps {
    values: string[];
    t: any;
}

const TacticsCell: React.FC<TacticsCellProps> = ({ values, t }) => {
    if (!values || values.length === 0) {
        return <Tag color="default">{t("Common.unknown")}</Tag>;
    }

    const inlineCount = 2;
    const inlineTactics = values.slice(0, inlineCount);
    const remainingCount = values.length - inlineCount;

    const inlineTags = inlineTactics.map((val) => (
        <Tag color={getTagColor("ALLOWED_TACTICS", val)} key={val}>
            {t(`Enums.ALLOWED_TACTICS.${val}`)}
        </Tag>
    ));

    return (
        <Space wrap size={[12, 12]}>
            {inlineTags}
            {remainingCount > 0 && (
                <Popover
                    content={
                        <Space direction="vertical" size="small">
                            {values.slice(inlineCount).map((val) => (
                                <Tag color={getTagColor("ALLOWED_TACTICS", val)} key={val}>
                                    {t(`Enums.ALLOWED_TACTICS.${val}`)}
                                </Tag>
                            ))}
                        </Space>
                    }
                    title={t("ReportModal.labels.tactics")}
                >
                    <Tag style={{ cursor: "pointer" }}>+{remainingCount} more</Tag>
                </Popover>
            )}
        </Space>
    );
};

export default TacticsCell;
