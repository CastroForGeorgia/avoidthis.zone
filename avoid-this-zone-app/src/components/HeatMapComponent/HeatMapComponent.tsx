import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useMap } from '@terrestris/react-util';

import { fromLonLat } from 'ol/proj';
import { Heatmap as HeatmapLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';

import { HeatMapPoint, AppDataContextProvider } from '../../app/providers/AppDataContextProvider';

interface HeatMapComponentProps {
  /** Optional heatmap blur (default 5) */
  blur?: number;
  /** Optional heatmap radius (default 10) */
  radius?: number;
}

export const HeatMapComponent: React.FC<HeatMapComponentProps> = ({
  blur = 5,
  radius = 10
}) => {
  const map = useMap();
  const { heatMapPoints: points } = useContext(AppDataContextProvider);

  // Store references to the heatmap layer and any features we add
  const [heatmapLayer] = useState(() => {
    const source = new VectorSource();
    const layer = new HeatmapLayer({
      source: source,
      blur,
      radius,
      weight: (feature) => feature.get('weight') || 1,
      // New gradient: from determined deep blue to passionate red.
      gradient: ['#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#f44336'],
      properties: { name: 'Heatmap Layer' },
    });
    return layer;
  });

  // Keep track of "local" features if needed
  const [features, setFeatures] = useState<Feature<Point>[]>([]);

  /**
   * Add a single point as feature on the heatmap.
   */
  const addFeature = useCallback((pt: HeatMapPoint) => {
    const { lon, lat, weight = 1 } = pt;
    if (lon === undefined || lat === undefined) return;
    const feature = new Feature({
      geometry: new Point(fromLonLat([lon, lat])),
      weight
    });
    setFeatures(prev => [...prev, feature]);
    heatmapLayer.getSource()?.addFeature(feature);
  }, [heatmapLayer]);

  useEffect(() => {
    if (!map) return;
    map.addLayer(heatmapLayer);

    // Clear old features if needed
    heatmapLayer.getSource()?.clear();
    setFeatures([]);

    // Add features for each point
    points.forEach(pt => addFeature(pt));

    return () => {
      // Cleanup
      map.removeLayer(heatmapLayer);
    };
  }, [map, heatmapLayer, points, addFeature]);

  return null;
};
