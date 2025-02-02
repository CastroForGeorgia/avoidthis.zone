// src/components/RaidReportTable/DateRangeFilterDropdown.tsx
import React from "react";
import { DatePicker, Button, Space } from "antd";
import moment from "moment";
import type { Key } from "react";

const { RangePicker } = DatePicker;

interface DateRangeFilterDropdownProps {
    setSelectedKeys: (selectedKeys: Key[]) => void;
    selectedKeys: Key[];
    confirm: () => void;
    clearFilters?: () => void;
    t: any;
}

const DateRangeFilterDropdown: React.FC<DateRangeFilterDropdownProps> = ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    t,
}) => {
    const currentRange = (selectedKeys[0] as any) || [];

    return (
        <div style={{ padding: 8 }}>
            <RangePicker
                value={currentRange}
                disabledDate={(current) =>
                    current && current > moment().endOf("day")
                }
                onChange={(dates) => {
                    setSelectedKeys(dates ? ([dates] as unknown as Key[]) : []);
                }}
                style={{ marginBottom: 8, display: "block" }}
            />
            <Space>
                <Button type="primary" onClick={confirm} size="small" style={{ width: 90 }}>
                    {t("Common.filter")}
                </Button>
                <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
                    {t("Common.resetButton")}
                </Button>
            </Space>
        </div>
    );
};

export default DateRangeFilterDropdown;
