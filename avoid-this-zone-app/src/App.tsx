import React, { useEffect } from 'react';
import BasicMapComponent from './components/BasicMapComponent';
import SideDrawer from './components/SideDrawer';
import ToggleDrawerButton from './components/ToggleDrawerButton';

import { useAppSelector } from './hooks/useAppSelector';
import { signInAnonymouslyIfNeeded } from './firebase';
import './App.less';
import { DoubleClickDragZoomExtension } from './map/DoubleClickDragZoomExtension';

export const App: React.FC = (): JSX.Element => {
  const isDrawerVisible = useAppSelector((state) => state.drawer.visible);

  useEffect(() => {
    // Attempt to sign in the user anonymously on mount
    signInAnonymouslyIfNeeded();
  }, []);

  return (
    <div className="App">
      {/* The actual map */}
      <BasicMapComponent />
      {/* Attach the OL DblClickDragZoom interaction */}
      <DoubleClickDragZoomExtension />
      {/* Some UI controls on top of the map */}
      <div className={`map-controls ${isDrawerVisible ? 'drawer-open' : ''}`}>
        {/* <BasicNominatimSearch /> */}
        <ToggleDrawerButton />
      </div>
      <SideDrawer />
    </div>
  );
};

export default App;