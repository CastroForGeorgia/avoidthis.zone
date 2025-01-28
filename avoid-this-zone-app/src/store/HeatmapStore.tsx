// src/stores/HeatmapStore.tsx

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import HeatmapLayer from 'ol/layer/Heatmap';
import VectorSource from 'ol/source/Vector';
import { RaidReportFirestoreData } from '../firebase/firestore';
import { Map as OlMap } from 'ol';
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore'; // Ensure Firebase is initialized
import { fromLonLat } from 'ol/proj';

interface HeatmapStoreType {
  features: Feature[];
  clearFeatures: () => void;
}

const HeatmapStoreContext = createContext<HeatmapStoreType | null>(null);

/**
 * Hook to use the HeatmapStore from any child component
 */
export function useHeatmapStore() {
  const ctx = useContext(HeatmapStoreContext);
  if (!ctx) {
    throw new Error('useHeatmapStore must be used within HeatmapStoreProvider');
  }
  return ctx;
}

interface HeatmapStoreProviderProps {
  children: React.ReactNode;
  map: OlMap;
}

export const HeatmapStoreProvider: React.FC<HeatmapStoreProviderProps> = ({ children, map }) => {
  const [features, setFeatures] = useState<Feature[]>([]);

  // Initialize the heatmap layer
  const [heatmapLayer] = useState(() => {
    const source = new VectorSource();
    const layer = new HeatmapLayer({
      source: source,
      blur: 1,
      radius: 4,
      weight: (feature) => feature.get('weight') || 1,
      gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'], // Customize as needed
      properties: { name: 'Heatmap Layer' },
    });
    map.addLayer(layer);
    return layer;
  });

  /**
   * Adds a single feature to the heatmap.
   */
  const addFeature = useCallback((data: RaidReportFirestoreData) => {
    data.coordinates.forEach((coordinate) => {
        const { longitude, latitude } = coordinate.geopoint;
        if (longitude === undefined || latitude === undefined) return;
    
        // Transform coordinates from EPSG:4326 to EPSG:3857
        // const transformedCoords = fromLonLat([longitude, latitude]);

        const feature = new Feature({
          geometry: new Point(fromLonLat([latitude, longitude])),
          weight: .5,
        });
    
        setFeatures((prev) => [...prev, feature]);
        heatmapLayer.getSource()?.addFeature(feature);
    })

  }, [heatmapLayer]);

  /**
   * Clears all features from the heatmap.
   */
  const clearFeatures = useCallback(() => {
    setFeatures([]);
    heatmapLayer.getSource()?.clear();
  }, [heatmapLayer]);

  /**
   * Sets up a real-time listener to Firestore's 'heatmap' collection.
   */
  useEffect(() => {
    const db = getFirestore();
    const heatmapCollection = collection(db, 'raidReports');

    const unsubscribe = onSnapshot(heatmapCollection, (snapshot: QuerySnapshot<DocumentData>) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data() as RaidReportFirestoreData;
          addFeature(data);
        }
        // Optionally handle 'modified' and 'removed' types if needed
      });
    }, (error) => {
      console.error('Error listening to heatmap data:', error);
      // Optionally, implement error state management here
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [addFeature]);

  return (
    <HeatmapStoreContext.Provider value={{ features, clearFeatures }}>
      {children}
    </HeatmapStoreContext.Provider>
  );
};
