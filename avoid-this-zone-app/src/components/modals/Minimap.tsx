import React, { useEffect, useState } from 'react';
import { Map as OlMap, View } from 'ol';

import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat, toLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';

export const Minimap: React.FC<{
    coordinates: [number, number];
    onCenterChange?: (center: [number, number]) => void;
}> = ({ coordinates, onCenterChange }) => {
    const [minimap, setMinimap] = useState<OlMap | null>(null);

    useEffect(() => {
        if (!minimap) {
            const newMinimap = new OlMap({
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                ],
                view: new View({
                    center: fromLonLat([-84.388, 33.749]), // Default center
                    zoom: 15,
                    minZoom: 15,
                    maxZoom: 15,
                }),
                controls: [],
            });
            setMinimap(newMinimap);
        }



        if (minimap && coordinates) {
            minimap.getView().setCenter(coordinates);
        }
    }, [minimap, coordinates]);

    useEffect(() => {
        if (minimap && onCenterChange) {
            const handleChange = () => {
                const center = minimap?.getView().getCenter();;
                if (center) {
                    onCenterChange(toLonLat(center) as [number, number]);
                }
            };

            minimap.addEventListener('moveend', handleChange)
            return () => {
                minimap.removeEventListener('change:view', handleChange)
            };
        }
    }, [minimap, onCenterChange]);

    return minimap ? (
        <div style={{ height: '200px', marginBottom: '16px', position: 'relative' }}>
            {/* Map Component */}
            <MapComponent
                id="minimap"
                map={minimap}
                className="minimap"
                style={{
                    width: '100%',
                    height: '100%',
                    border: '1px solid #ddd',
                }}
            />
            {/* Circle Icon Overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10, // Ensure it is on top of the map
                    pointerEvents: 'none', // Allow interaction with the map
                }}
            >
                <i className="fas fa-circle" style={{ fontSize: '48px', color: 'red' }}></i>
            </div>
        </div>
    ) : null;
};