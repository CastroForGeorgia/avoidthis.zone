import React, { useEffect, Suspense } from "react";
import { Drawer, Spin, Alert } from "antd";
import { DrawerProps } from "antd/lib/drawer";
import { useTranslation } from "react-i18next";

const BasicLayerTree = React.lazy(() => import("../BasicLayerTree"));

import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { toggleVisibility } from "../../store/drawer";
import { fetchEnumValues } from "../../firebase";
import { EnumForm } from "../forms/EnumForm";

import "./SideDrawer.less";

const SideDrawer: React.FC<Partial<DrawerProps>> = (props): JSX.Element => {
  const dispatch = useAppDispatch();
  const visible = useAppSelector((state) => state.drawer.visible);
  const { t } = useTranslation();

  // State for enumerations
  const [enumData, setEnumData] = React.useState<Record<string, any> | null>(null);
  const [isLoadingEnums, setIsLoadingEnums] = React.useState(false);
  const [enumError, setEnumError] = React.useState<string | null>(null);

  useEffect(() => {
    if (visible && !enumData) {
      const loadEnums = async () => {
        setIsLoadingEnums(true);
        setEnumError(null);
        try {
          const data = await fetchEnumValues();
          if (data) {
            setEnumData(data);
          } else {
            setEnumError(t("SideDrawer.errorMessages.failedToLoadData"));
          }
        } catch (error) {
          console.error("Error fetching enums:", error);
          setEnumError(t("SideDrawer.errorMessages.genericError"));
        } finally {
          setIsLoadingEnums(false);
        }
      };

      loadEnums();
    }
  }, [visible, enumData, t]);

  const toggleDrawer = () => {
    dispatch(toggleVisibility());
  };

  const handleFormSubmit = (values: any) => {
    console.log("Form Submitted with values:", values);

    // Close the drawer after submission
    toggleDrawer();
  };

  return (
    <Drawer
      title={t("SideDrawer.title")}
      placement="right"
      onClose={toggleDrawer}
      open={visible}
      mask={false}
      className="custom-side-drawer"
      destroyOnClose
      {...props}
    >
      {isLoadingEnums ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin tip={t("SideDrawer.loading")} />
        </div>
      ) : enumError ? (
        <Alert
          message={t("SideDrawer.error")}
          description={enumError}
          type="error"
          showIcon
          closable
        />
      ) : enumData ? (
        <>
          <EnumForm
            enumData={enumData}
            isLoading={isLoadingEnums}
            error={enumError}
            onReset={toggleDrawer}
          />

          {/* Additional Content (Lazy Loaded Component) */}
          {/* <Suspense fallback={<Spin tip={t("SideDrawer.loadingLayers")} />}>
            <BasicLayerTree />
          </Suspense> */}
        </>
      ) : (
        <Alert
          message={t("SideDrawer.noData")}
          description={t("SideDrawer.noDataDescription")}
          type="warning"
          showIcon
          closable
        />
      )}
    </Drawer>
  );
};

export default SideDrawer;
