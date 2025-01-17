import React, { useEffect } from 'react';
import BasicMapComponent from './components/BasicMapComponent';
import BasicNominatimSearch from './components/BasicNominatimSearch';
import SideDrawer from './components/SideDrawer';
import ToggleDrawerButton from './components/ToggleDrawerButton';

import { useAppSelector } from './hooks/useAppSelector';
import { signInAnonymouslyIfNeeded } from './firebase';
import './App.less';

export const App: React.FC = (): JSX.Element => {
  const isDrawerVisible = useAppSelector((state) => state.drawer.visible);

  useEffect(() => {
    // Attempt to sign in the user anonymously on mount
    signInAnonymouslyIfNeeded();
  }, []);

  return (
    <div className="App">
      <BasicMapComponent />
      <div className={`map-controls ${isDrawerVisible && 'drawer-open'}`}>
        <BasicNominatimSearch />
        <ToggleDrawerButton />
      </div>
      <SideDrawer />
    </div>
  );
};

export default App;
