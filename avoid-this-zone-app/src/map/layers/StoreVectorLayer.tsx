import React, { useEffect, useMemo } from 'react';
import VectorSource from 'ol/source/Vector.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import { useMap } from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import { useFeatureStore } from '../../store/FeatureStore';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';

export const StoreVectorLayer: React.FC = () => {
  const map = useMap();
  const { features } = useFeatureStore();

  // Make a single VectorSource & Layer instance
  const vectorSrc = useMemo(() => new VectorSource({}), []);
  const vectorLy = useMemo(() => {
    return new VectorLayer({
      source: vectorSrc,
      style: new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({ color: 'rgba(255,0,0,0.8)' }),
          stroke: new Stroke({ color: '#fff', width: 2 })
        })
      })
    });
  }, [vectorSrc]);

  // Add or remove the layer from the map
  useEffect(() => {
    if (!map) return;
    map.addLayer(vectorLy);
    return () => {
      map.removeLayer(vectorLy);
    };
  }, [map, vectorLy]);

  // Whenever `features` changes, update the VectorSource
  useEffect(() => {
    // Clear & add the new features each time
    vectorSrc.clear(true);
    vectorSrc.addFeatures(features);
  }, [features, vectorSrc]);

  return null; // no visible UI
};