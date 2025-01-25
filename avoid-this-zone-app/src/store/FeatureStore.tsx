import React, { createContext, useContext, useState, useCallback } from 'react';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';

interface FeatureStoreType {
    features: Feature[];
    addFeature: (coords: [number, number]) => void;
}

const FeatureStoreContext = createContext<FeatureStoreType | null>(null);

/**
 * Hook to use the FeatureStore from any child component
 */
export function useFeatureStore() {
    const ctx = useContext(FeatureStoreContext);
    if (!ctx) {
        throw new Error('useFeatureStore must be used within FeatureStoreProvider');
    }
    return ctx;
}

/**
 * A fake store for features. We keep them in React state.
 * Eventually you can push them to a backend or Firebase.
 */
export const FeatureStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [features, setFeatures] = useState<Feature[]>([]);

    const addFeature = useCallback((coords: [number, number]) => {
        const newF = new Feature({
            geometry: new Point(coords),
        });
        setFeatures((prev) => [...prev, newF]);
    }, []);

    return (
        <FeatureStoreContext.Provider value={{ features, addFeature }}>
            {children}
        </FeatureStoreContext.Provider>
    );
};