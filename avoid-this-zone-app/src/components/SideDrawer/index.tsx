import React, { useState, useEffect } from 'react';
import { Checkbox, Drawer, Form, Select } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { useTranslation } from 'react-i18next';

const BasicLayerTree = React.lazy(() => import('../BasicLayerTree'));

import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { toggleVisibility } from '../../store/drawer';

import { fetchEnumValues } from '../../firebase'; // Firestore fetch function

import './SideDrawer.less'; // Additional styles

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
  const [enumData, setEnumData] = useState<null | Record<string, string[]>>(null);

  // ------------------------------
  // Fetch enums on mount
  // ------------------------------
  useEffect(() => {
    (async () => {
      const data = await fetchEnumValues();
      if (data) {
        setEnumData(data);
      }
    })();
  }, []);

  // ------------------------------
  // Loading state
  // ------------------------------
  if (!enumData) {
    return (
      <Drawer
        title={t('SideDrawer.title')}
        placement="right"
        onClose={() => dispatch(toggleVisibility())}
        open={visible}
        mask={false}
        className="custom-side-drawer"
        {...props}
      >
        <div>Loading enumerations...</div>
      </Drawer>
    );
  }

  // ------------------------------
  // Extract arrays from fetched data
  // (default to [] if missing)
  // ------------------------------
  const ALLOWED_TACTICS = enumData.ALLOWED_TACTICS || [];
  const ALLOWED_RAID_LOCATION_CATEGORY = enumData.ALLOWED_RAID_LOCATION_CATEGORY || [];
  const ALLOWED_DETAIL_LOCATION = enumData.ALLOWED_DETAIL_LOCATION || [];
  const ALLOWED_WAS_SUCCESSFUL = enumData.ALLOWED_WAS_SUCCESSFUL || [];
  const ALLOWED_LOCATION_REFERENCE = enumData.ALLOWED_LOCATION_REFERENCE || [];
  const ALLOWED_SOURCE_OF_INFO = enumData.ALLOWED_SOURCE_OF_INFO || [];

  // ------------------------------
  // Handlers
  // ------------------------------
  const toggleDrawer = () => {
    dispatch(toggleVisibility());
  };

  const handleTacticChange = (checkedValues: string[]) => {
    setSelectedTactics(checkedValues);
  };

  return (
    <Drawer
      title={t('SideDrawer.title')}
      placement="right"
      onClose={toggleDrawer}
      open={visible}
      mask={false}
      className="custom-side-drawer"
      {...props}
    >
      <React.Suspense fallback={null}>
        <Form layout="vertical">
          {/* Tactics (Multiple) */}
          <Form.Item label="Tactics">
            <Checkbox.Group
              options={ALLOWED_TACTICS.map((tactic) => ({
                label: tactic,
                value: tactic
              }))}
              value={selectedTactics}
              onChange={handleTacticChange}
            />
          </Form.Item>

          {/* Raid Location Category (Single) */}
          <Form.Item label="Raid Location Category">
            <Select
              placeholder="Select a category"
              value={selectedRaidCategory}
              onChange={setSelectedRaidCategory}
              allowClear
            >
              {ALLOWED_RAID_LOCATION_CATEGORY.map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Detail Location (Single) */}
          <Form.Item label="Detail Location">
            <Select
              placeholder="Select a detail location"
              value={selectedDetailLocation}
              onChange={setSelectedDetailLocation}
              allowClear
            >
              {ALLOWED_DETAIL_LOCATION.map((detail) => (
                <Select.Option key={detail} value={detail}>
                  {detail}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Was Successful (Single) */}
          <Form.Item label="Was Successful">
            <Select
              placeholder="Select outcome"
              value={selectedWasSuccessful}
              onChange={setSelectedWasSuccessful}
              allowClear
            >
              {ALLOWED_WAS_SUCCESSFUL.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Location Reference (Single) */}
          <Form.Item label="Location Reference">
            <Select
              placeholder="Select reference"
              value={selectedLocationReference}
              onChange={setSelectedLocationReference}
              allowClear
            >
              {ALLOWED_LOCATION_REFERENCE.map((ref) => (
                <Select.Option key={ref} value={ref}>
                  {ref}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Source of Info (Single) */}
          <Form.Item label="Source of Info">
            <Select
              placeholder="Select source"
              value={selectedSourceOfInfo}
              onChange={setSelectedSourceOfInfo}
              allowClear
            >
              {ALLOWED_SOURCE_OF_INFO.map((source) => (
                <Select.Option key={source} value={source}>
                  {source}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

        </Form>
      </React.Suspense>
    </Drawer>
  );
};

export default SideDrawer;