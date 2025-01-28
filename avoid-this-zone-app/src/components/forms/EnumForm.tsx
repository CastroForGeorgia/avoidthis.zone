import React from "react";
import { Form, Button, Spin, Alert } from "antd";
import { useTranslation } from "react-i18next";
import DetailLocationSelector from "../selectors/DetailLocationSelector";
import LocationReferenceSelector from "../selectors/LocationReferenceSelector";
import RaidLocationCategorySelector from "../selectors/RaidLocationCategorySelector";
import SourceOfInfoSelector from "../selectors/SourceOfInfoSelector";
import TacticsSelector from "../selectors/TacticsSelector";
import WasSuccessfulSelector from "../selectors/WasSuccessfulSelector";
import DatePicker from "antd/lib/date-picker";

export const EnumForm: React.FC<{
    enumData: Record<string, any> | null;
    isLoading: boolean;
    error: string | null;
    onSubmit?: (values: any) => void;
    onCancel?: () => void;
    onReset?: () => void;
}> = ({ enumData, isLoading, error, onSubmit, onCancel, onReset }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "20px" }}>
                <Spin tip={t("ReportModal.loadingMessage")} />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message={t("ReportModal.errorMessage")}
                description={error}
                type="error"
                showIcon
                closable
            />
        );
    }

    if (!enumData) {
        return null;
    }

    const handleReset = () => {
        form.resetFields();
        if (onReset) {
            onReset();
        }
    };

    return (
        <Form
            form={form}
            onFinish={onSubmit}
            layout="vertical"
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
            <Form.Item
                label={t("ReportModal.labels.tactics")}
                name="tacticsUsed"
                rules={[
                    {
                        required: true,
                        message: t("ReportModal.formErrors.requiredField"),
                    },
                ]}
            >
                <TacticsSelector options={enumData.ALLOWED_TACTICS} />
            </Form.Item>

            <Form.Item
                label={t("ReportModal.labels.raidLocationCategory")}
                name="raidLocationCategory"
                rules={[
                    {
                        required: true,
                        message: t("ReportModal.formErrors.requiredField"),
                    },
                ]}
            >
                <RaidLocationCategorySelector options={enumData.ALLOWED_RAID_LOCATION_CATEGORY} />
            </Form.Item>

            <Form.Item
                label={t("ReportModal.labels.detailLocation")}
                name="detailLocation"
                rules={[
                    {
                        required: true,
                        message: t("ReportModal.formErrors.requiredField"),
                    },
                ]}
            >
                <DetailLocationSelector options={enumData.ALLOWED_DETAIL_LOCATION} />
            </Form.Item>

            <Form.Item
                label={t("ReportModal.labels.wasSuccessful")}
                name="wasSuccessful"
                rules={[
                    {
                        required: true,
                        message: t("ReportModal.formErrors.requiredField"),
                    },
                ]}
            >
                <WasSuccessfulSelector options={enumData.ALLOWED_WAS_SUCCESSFUL} />
            </Form.Item>

            <Form.Item
                label={t("ReportModal.labels.locationReference")}
                name="locationReference"
                rules={[
                    {
                        required: true,
                        message: t("ReportModal.formErrors.requiredField"),
                    },
                ]}
            >
                <LocationReferenceSelector options={enumData.ALLOWED_LOCATION_REFERENCE} />
            </Form.Item>

            <Form.Item
                label={t("ReportModal.labels.sourceOfInfo")}
                name="sourceOfInfo"
                rules={[
                    {
                        required: true,
                        message: t("ReportModal.formErrors.requiredField"),
                    },
                ]}
            >
                <SourceOfInfoSelector options={enumData.ALLOWED_SOURCE_OF_INFO} />
            </Form.Item>

            <Form.Item
                label={t("ReportModal.labels.dateOfRaid")}
                name="dateOfRaid"
                rules={[
                    // No 'required' rule means the field is optional
                    {
                        type: "object",
                        message: t("ReportModal.formErrors.invalidDate"),
                    },
                ]}
            >
                <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <div
                className="modal-footer"
                style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
            >
                {onReset && (
                    <Button onClick={handleReset} style={{ marginRight: "8px" }}>
                        {t("Common.resetButton")}
                    </Button>
                )}
                {onCancel && (
                    <Button onClick={onCancel} style={{ marginRight: "8px" }}>
                        {t("Common.cancelButton")}
                    </Button>
                )}
                {onSubmit && (
                    <Button type="primary" htmlType="submit">
                        {t("Common.confirmButton")}
                    </Button>
                )}
            </div>
        </Form>
    );
};
