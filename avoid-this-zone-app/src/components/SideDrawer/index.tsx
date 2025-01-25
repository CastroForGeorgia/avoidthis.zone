// src/components/SideDrawer.tsx
import React, { useState, useEffect, Suspense } from 'react';
import { Checkbox, Drawer, Form, Select, Spin, Alert, Button } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { useTranslation } from 'react-i18next';

const BasicLayerTree = React.lazy(() => import('../BasicLayerTree'));

import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { toggleVisibility } from '../../store/drawer';

import { fetchEnumValues } from '../../firebase'; // Firestore fetch function

import './SideDrawer.less'; // Additional styles

// Optional: Define TypeScript interface for enum data
interface EnumData {
  ALLOWED_TACTICS: string[];
  ALLOWED_RAID_LOCATION_CATEGORY: string[];
  ALLOWED_DETAIL_LOCATION: string[];
  ALLOWED_WAS_SUCCESSFUL: string[];
  ALLOWED_LOCATION_REFERENCE: string[];
  ALLOWED_SOURCE_OF_INFO: string[];
}

export const SideDrawer: React.FC<Partial<DrawerProps>> = (props): JSX.Element => {
  const dispatch = useAppDispatch();
  const visible = useAppSelector((state) => state.drawer.visible);
  const { t } = useTranslation();

  // ------------------------------
  // Local state for user selections
  // ------------------------------
  const [selectedTactics, setSelectedTactics] = useState<string[]>([]);
  const [selectedRaidCategory, setSelectedRaidCategory] = useState<string | undefined>();
  const [selectedDetailLocation, setSelectedDetailLocation] = useState<string | undefined>();
  const [selectedWasSuccessful, setSelectedWasSuccessful] = useState<string | undefined>();
  const [selectedLocationReference, setSelectedLocationReference] = useState<string | undefined>();
  const [selectedSourceOfInfo, setSelectedSourceOfInfo] = useState<string | undefined>();

  // ------------------------------
  // State for enumerations from Firestore
  // ------------------------------
  const [enumData, setEnumData] = useState<EnumData | null>(null);
  const [isLoadingEnums, setIsLoadingEnums] = useState(false);
  const [enumError, setEnumError] = useState<string | null>(null);

  // ------------------------------
  // Fetch enums when the drawer is opened
  // ------------------------------
  useEffect(() => {
    if (visible && !enumData) {
      const loadEnums = async () => {
        setIsLoadingEnums(true);
        setEnumError(null);
        try {
          const data = await fetchEnumValues();
          if (data) {
            setEnumData(data as EnumData);
          } else {
            setEnumError("Failed to load enumeration data.");
          }
        } catch (error) {
          console.error("Error fetching enums:", error);
          setEnumError("An error occurred while fetching data.");
        } finally {
          setIsLoadingEnums(false);
        }
      };

      loadEnums();
    }
  }, [visible, enumData]);

  // ------------------------------
  // Handlers
  // ------------------------------
  const toggleDrawer = () => {
    dispatch(toggleVisibility());
  };

  const handleTacticChange = (checkedValues: string[]) => {
    setSelectedTactics(checkedValues);
  };

  const handleFormReset = () => {
    setSelectedTactics([]);
    setSelectedRaidCategory(undefined);
    setSelectedDetailLocation(undefined);
    setSelectedWasSuccessful(undefined);
    setSelectedLocationReference(undefined);
    setSelectedSourceOfInfo(undefined);
  };

  // ------------------------------
  // Form Submission Handler (Optional)
  // ------------------------------
  const handleFormSubmit = () => {
    // Implement form submission logic here
    // For example, dispatching actions or calling APIs
    console.log('Form Submitted with values:', {
      selectedTactics,
      selectedRaidCategory,
      selectedDetailLocation,
      selectedWasSuccessful,
      selectedLocationReference,
      selectedSourceOfInfo,
    });

    // Close the drawer after submission
    toggleDrawer();
    handleFormReset();
  };

  // ------------------------------
  // Render Logic
  // ------------------------------
  return (
    <Drawer
      title={t('SideDrawer.title')}
      placement="right"
      onClose={toggleDrawer}
      open={visible}
      mask={false}
      className="custom-side-drawer"
      destroyOnClose
      {...props}
    >
      {isLoadingEnums ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin tip="Loading..." />
        </div>
      ) : enumError ? (
        <Alert
          message="Error"
          description={enumError}
          type="error"
          showIcon
          closable
        />
      ) : enumData ? (
        <Form layout="vertical" onFinish={handleFormSubmit}>
          {/* Tactics (Multiple) */}
          <Form.Item
            label="Tactics"
            required
            rules={[{ required: true, message: 'Please select at least one tactic.' }]}
          >
            <Checkbox.Group
              options={enumData.ALLOWED_TACTICS.map((tactic) => ({
                label: tactic,
                value: tactic
              }))}
              value={selectedTactics}
              onChange={handleTacticChange}
            />
          </Form.Item>

          {/* Raid Location Category (Single) */}
          <Form.Item
            label="Raid Location Category"
            required
            rules={[{ required: true, message: 'Please select a raid location category.' }]}
          >
            <Select
              placeholder="Select a category"
              value={selectedRaidCategory}
              onChange={setSelectedRaidCategory}
              allowClear
            >
              {enumData.ALLOWED_RAID_LOCATION_CATEGORY.map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Detail Location (Single) */}
          <Form.Item
            label="Detail Location"
            required
            rules={[{ required: true, message: 'Please select a detail location.' }]}
          >
            <Select
              placeholder="Select a detail location"
              value={selectedDetailLocation}
              onChange={setSelectedDetailLocation}
              allowClear
            >
              {enumData.ALLOWED_DETAIL_LOCATION.map((detail) => (
                <Select.Option key={detail} value={detail}>
                  {detail}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Was Successful (Single) */}
          <Form.Item
            label="Was Successful"
            required
            rules={[{ required: true, message: 'Please select an outcome.' }]}
          >
            <Select
              placeholder="Select outcome"
              value={selectedWasSuccessful}
              onChange={setSelectedWasSuccessful}
              allowClear
            >
              {enumData.ALLOWED_WAS_SUCCESSFUL.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Location Reference (Single) */}
          <Form.Item
            label="Location Reference"
            required
            rules={[{ required: true, message: 'Please select a location reference.' }]}
          >
            <Select
              placeholder="Select reference"
              value={selectedLocationReference}
              onChange={setSelectedLocationReference}
              allowClear
            >
              {enumData.ALLOWED_LOCATION_REFERENCE.map((ref) => (
                <Select.Option key={ref} value={ref}>
                  {ref}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Source of Info (Single) */}
          <Form.Item
            label="Source of Info"
            required
            rules={[{ required: true, message: 'Please select a source of information.' }]}
          >
            <Select
              placeholder="Select source"
              value={selectedSourceOfInfo}
              onChange={setSelectedSourceOfInfo}
              allowClear
            >
              {enumData.ALLOWED_SOURCE_OF_INFO.map((source) => (
                <Select.Option key={source} value={source}>
                  {source}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Additional Content (Lazy Loaded Component) */}
          <Suspense fallback={<Spin tip="Loading layers..." />}>
            <BasicLayerTree />
          </Suspense>

          {/* Form Actions */}
          <div className="drawer-footer" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button onClick={toggleDrawer} style={{ marginRight: '8px' }}>
              {t('SideDrawer.cancel')}
            </Button>
            <Button type="primary" htmlType="submit">
              {t('SideDrawer.submit')}
            </Button>
          </div>
        </Form>
      ) : (
        <Alert
          message="No Data"
          description="No enumeration data available."
          type="warning"
          showIcon
          closable
        />
      )}
    </Drawer>
  );
};

export default SideDrawer;
