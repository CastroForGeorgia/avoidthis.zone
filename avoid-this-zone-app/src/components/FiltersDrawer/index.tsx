import React, { useEffect } from 'react';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { Alert, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { fetchEnumValues } from '../../firebase';
import { useAppSelector } from '../../hooks/useAppSelector';
import { EnumForm } from '../forms/EnumForm';

const FiltersDrawer: React.FC = () => {
    const { t } = useTranslation();
    const visible = useAppSelector((state) => state.drawer.visible);
  
    // State for enumerations
    const [enumData, setEnumData] = React.useState<Record<string, any> | null>(null);
    const [isLoadingEnums, setIsLoadingEnums] = React.useState(false);
    const [enumError, setEnumError] = React.useState<string | null>(null);
  
    useEffect(() => {
      if (!enumData) {
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
    
  return (
    <div className="filters-content">
{/* Language Switcher */}
<LanguageSwitcher />

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
    />
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
    </div>
  );
};

export default FiltersDrawer;
