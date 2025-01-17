import React, { useState } from 'react';

import { Checkbox, Drawer, Form, Select } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';

import { useTranslation } from 'react-i18next';

const BasicLayerTree = React.lazy(() => import('../BasicLayerTree'));
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { toggleVisibility } from '../../store/drawer';

import './SideDrawer.less'; // Import the LESS file for additional styles

export const SideDrawer: React.FC<Partial<DrawerProps>> = (props): JSX.Element => {
  const dispatch = useAppDispatch();
  const visible = useAppSelector((state) => state.drawer.visible);
  const { t } = useTranslation();

  // Local state for filters
  const [selectedTactics, setSelectedTactics] = useState<string[]>([]);
  const [selectedRaidCategory, setSelectedRaidCategory] = useState<string | undefined>();

  const toggleDrawer = () => {
    dispatch(toggleVisibility());
  };

  const handleTacticChange = (checkedValues: string[]) => {
    setSelectedTactics(checkedValues);
  };

  const handleRaidCategoryChange = (value: string) => {
    setSelectedRaidCategory(value);
  };

  const ALLOWED_TACTICS = [
    "SURVEILLANCE",
    "WARRANTLESS_ENTRY",
    "RUSE",
    "COLLATERAL_ARREST",
    "USE_OF_FORCE",
    "CHECKPOINT",
    "KNOCK_AND_TALK",
    "ID_CHECK",
    "DRONE_SURVEILLANCE", // New custom tactic
  ] as const;


  const ALLOWED_RAID_LOCATION_CATEGORY = [
    "HOME",
    "PUBLIC",
    "WORK",
    "COURT",
    "HOSPITAL",
    "BORDER",
    "OTHER",
    "SCHOOL", // New custom location category
  ] as const;


  return (
    <Drawer
      title={t('SideDrawer.title')}
      placement="right"
      onClose={toggleDrawer}
      open={visible}
      mask={false}
      className="custom-side-drawer" // Add a custom class for styling
      {...props}
    >
      <React.Suspense fallback={null}>
        {/* <BasicLayerTree /> */}
        {/* Additional Filters */}
        <Form layout="vertical">
          <Form.Item label="Tactics">
            <Checkbox.Group
              options={ALLOWED_TACTICS.map((tactic) => ({ label: tactic, value: tactic }))}
              value={selectedTactics}
              onChange={handleTacticChange}
            />
          </Form.Item>

          <Form.Item label="Raid Location Category">
            <Select
              placeholder="Select a category"
              value={selectedRaidCategory}
              onChange={handleRaidCategoryChange}
              allowClear
            >
              {ALLOWED_RAID_LOCATION_CATEGORY.map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
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