import React, { useEffect } from 'react';
import { MapComponent, MapComponentProps } from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import { useMap } from '@terrestris/react-util/dist/Hooks/useMap/useMap';

import { useAppSelector } from '../../hooks/useAppSelector';
import ReportModal from '../modals/ReportModal';

import './index.less';

export const BasicMapComponent: React.FC<Partial<MapComponentProps>> = (props): JSX.Element => {
  const map = useMap();
  const isDrawerVisible = useAppSelector((state) => state.drawer.visible);


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
    return <></>; // Render nothing if no map instance or enums are loaded
  }

  return (
    <>
      <MapComponent map={map} {...props} />
      <ReportModal
        map={map}
        onSubmit={(report: any) => console.log('Submitted Report:', report)}
      />
    </>
  );
};

export default BasicMapComponent;