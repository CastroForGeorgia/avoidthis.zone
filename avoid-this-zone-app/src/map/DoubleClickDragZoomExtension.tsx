// src/components/map/DoubleClickDragZoomExtension.tsx
import React from 'react';
import { useMap } from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import { useDoubleClickDragZoom } from '../hooks/useDoubleClickDragZoom';

/**
 * Adds the DblClickDragZoom interaction to the map. 
 * Nothing is rendered; it’s purely for side effects.
 */
export const DoubleClickDragZoomExtension: React.FC = () => {
  const map = useMap();

  // Attach the DblClickDragZoom to the map
  useDoubleClickDragZoom(map);

  // Return nothing; no visible UI needed
  return null;
};