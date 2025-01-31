import React from "react";
import { Form, Button, Spin, Alert, Row, Col, Collapse, Input } from "antd";
import { useTranslation } from "react-i18next";
import DetailLocationSelector from "../selectors/DetailLocationSelector";
import LocationReferenceSelector from "../selectors/LocationReferenceSelector";
import RaidLocationCategorySelector from "../selectors/RaidLocationCategorySelector";
import SourceOfInfoSelector from "../selectors/SourceOfInfoSelector";
import TacticsSelector from "../selectors/TacticsSelector";
import WasSuccessfulSelector from "../selectors/WasSuccessfulSelector";

const { Panel } = Collapse;

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
      style={{ gap: "16px" }}
    >
      {/* Always visible required fields */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
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
        </Col>
        <Col span={24}>
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
            <SourceOfInfoSelector
              options={enumData.ALLOWED_SOURCE_OF_INFO}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Optional sourceOfInfoUrl field */}
      {/* <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label={t("ReportModal.labels.sourceOfInfoUrl")}
            name="sourceOfInfoUrl"
            rules={[
              {
                type: "url",
                message: t("ReportModal.formErrors.invalidUrl"),
              },
            ]}
          >
            <Input
              placeholder={t("ReportModal.labels.sourceOfInfoUrlPlaceholder")}
            />
          </Form.Item>
        </Col>
      </Row> */}

      {/* Collapsible optional filters */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Collapse accordion>
            <Panel header={t("ReportModal.labels.filters")} key="1">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label={t("ReportModal.labels.raidLocationCategory")}
                    name="raidLocationCategory"
                  >
                    <RaidLocationCategorySelector
                      options={enumData.ALLOWED_RAID_LOCATION_CATEGORY}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t("ReportModal.labels.detailLocation")}
                    name="detailLocation"
                  >
                    <DetailLocationSelector
                      options={enumData.ALLOWED_DETAIL_LOCATION}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label={t("ReportModal.labels.wasSuccessful")}
                    name="wasSuccessful"
                  >
                    <WasSuccessfulSelector
                      options={enumData.ALLOWED_WAS_SUCCESSFUL}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t("ReportModal.labels.locationReference")}
                    name="locationReference"
                  >
                    <LocationReferenceSelector
                      options={enumData.ALLOWED_LOCATION_REFERENCE}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </Col>
      </Row>

      {/* Footer Buttons with spacing */}
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }} justify="end">
        <Col>
          {onReset && (
            <Button onClick={handleReset}>
              {t("Common.resetButton")}
            </Button>
          )}
        </Col>
        <Col>
          {onCancel && (
            <Button onClick={onCancel}>
              {t("Common.cancelButton")}
            </Button>
          )}
        </Col>
        <Col>
          {onSubmit && (
            <Button type="primary" htmlType="submit">
              {t("Common.confirmButton")}
            </Button>
          )}
        </Col>
      </Row>
    </Form>
  );
};
