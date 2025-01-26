import React, { useEffect, useState } from 'react';
import { MapComponent, MapComponentProps } from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import { useMap } from '@terrestris/react-util/dist/Hooks/useMap/useMap';

import { useAppSelector } from '../../hooks/useAppSelector';
import ReportModal from '../modals/ReportModal';

import './index.less';

export const BasicMapComponent: React.FC<Partial<MapComponentProps>> = (props): JSX.Element => {
  const map = useMap();
  const isDrawerVisible = useAppSelector((state) => state.drawer.visible);
  const [clickedCoordinates, setClickedCoordinates] = useState<[number, number] | null>(null);

  const handleMapClick = (evt: any) => {
    const coordinates = evt.coordinate as [number, number];
    setClickedCoordinates(coordinates);
  };

  useEffect(() => {
    if (!map) return;

    // Attach the click listener
    map.on('singleclick', handleMapClick);

    // Cleanup listener on unmount
    return () => {
      map.un('singleclick', handleMapClick);
    };
  }, [map]);

  useEffect(() => {
    const attrEl = document.querySelector('.ol-attribution');
    if (!attrEl) return;

    if (isDrawerVisible) {
      attrEl.classList.add('drawer-open');
    } else {
      attrEl.classList.remove('drawer-open');
    }
  }, [isDrawerVisible]);

  if (!map) {
    return <></>; // Render nothing if no map instance is available
  }

  return (
    <>
      <MapComponent map={map} {...props} />
      {clickedCoordinates && (
        <ReportModal
          map={map}
          clickedCoordinates={clickedCoordinates}
          setClickedCoordinates={setClickedCoordinates}
          onSubmit={(report: any) => console.log('Submitted Report:', report)}
        />
      )}
    </>
  );
};

export default BasicMapComponent;
