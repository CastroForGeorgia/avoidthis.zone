import React, { useState } from 'react';
import { Layout, Drawer, Button } from 'antd';
import BasicMapComponent from './components/BasicMapComponent';
import FiltersDrawer from './components/FiltersDrawer';
import ResultsPanel from './components/ResultsPanel';
import { SettingOutlined } from '@ant-design/icons';
import './App.less';

const { Content } = Layout;

export const App: React.FC = (): JSX.Element => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  return (
    <Layout className="app-layout">
      {/* Top 2/3: Map Section */}
      <Content className="map-container">
        <BasicMapComponent />
      </Content>

      {/* Bottom 1/3: Results Panel */}
      <div className="results-panel">
        <ResultsPanel />
      </div>

      {/* Floating Button to Open Filters Drawer */}
      <Button
        className="filters-button"
        type="primary"
        shape="circle"
        icon={<SettingOutlined />}
        onClick={() => setDrawerVisible(true)}
      />

      {/* Slide-up Drawer for Filters/Settings */}
      <Drawer
        className="filters-drawer"
        placement="bottom"
        closable
        height="50vh"
        open={isDrawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        <FiltersDrawer />
      </Drawer>
    </Layout>
  );
};

export default App;
