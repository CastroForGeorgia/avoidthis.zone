/* -------------------------------------------------------------------
 * App.tsx — Tailwind‑first root layout
 * -------------------------------------------------------------------
 * ‣ Replaces Ant Design Layout/Drawer/Spinner with plain React + Tailwind
 * ‣ Retains OpenLayers map setup + context
 * ‣ Uses a simple bottom‑sheet for Settings
 * ------------------------------------------------------------------*/

import React, { useState } from 'react';
import { MapContext } from '@terrestris/react-util';
import RaidReportTable from '../components/RaidReportTable';
import { MapView } from '../components/mapView';
import setupMap from '../utils/setupMap';
import OlMap from 'ol/Map';


/* ------------------------------------------------------------------
   Main component
-------------------------------------------------------------------*/
const App: React.FC = () => {
  const [map] = useState<OlMap>(setupMap());

  /* ---------------- Normal Layout ---------------- */
  return (
    <MapContext.Provider value={map}>
      <div className="relative flex h-screen w-screen overflow-hidden">
        {/* Map & overlays */}
        <MapView />

        {/* Results side panel (desktop) */}
        <div className="hidden w-80 shrink-0 border-l border-gray-200 bg-white lg:block">
          <RaidReportTable />
        </div>

      </div>
    </MapContext.Provider>
  );
};

export default App;
