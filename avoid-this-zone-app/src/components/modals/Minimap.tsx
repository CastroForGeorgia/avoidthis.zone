import React, { useEffect, useState } from 'react';
import { Feature, Map as OlMap, View } from 'ol';

import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke, Fill } from 'ol/style';
import Circle from 'ol/geom/Circle';

export const Minimap: React.FC<{
    coordinates: [number, number];
    onCenterChange?: (center: [number, number]) => void;
}> = ({ coordinates, onCenterChange }) => {
    const [minimap, setMinimap] = useState<OlMap | null>(null);
    const [circleFeature, setCircleFeature] = useState<Feature | null>(null);

    useEffect(() => {
        if (!minimap) {
            const newMinimap = new OlMap({
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                ],
                view: new View({
                    center: coordinates, // Default center
                    zoom: 18,
                    minZoom: 18,
                    maxZoom: 18,
                }),
                controls: [],
            });

            // Create the circle feature and style
            const newCircleFeature = new Feature({
                geometry: new Circle(coordinates, 50), // Initial center and radius
            });
            newCircleFeature.setStyle(
                new Style({
                    stroke: new Stroke({
                        color: 'rgba(0, 0, 255, 1)',
                        width: 2,
                    }),
                    fill: new Fill({
                        color: 'rgba(0, 0, 255, 0.1)',
                    }),
                })
            );

            // Create vector layer for the circle
            const vectorSource = new VectorSource({
                features: [newCircleFeature],
            });
            const vectorLayer = new VectorLayer({ source: vectorSource });

            newMinimap.addLayer(vectorLayer);

            setMinimap(newMinimap);
            setCircleFeature(newCircleFeature);
        }
    }, [minimap]);

    useEffect(() => {
        if (minimap && onCenterChange) {
            const handleChange = () => {
                const center = minimap?.getView().getCenter();;
                if (center) {
                    onCenterChange(center as [number, number]);
                                // Update the circle's center if it exists
                    if (circleFeature) {
                        const circleGeometry = circleFeature.getGeometry() as Circle;
                        circleGeometry.setCenter(center);
                    }
                }
            };

            minimap.addEventListener('moveend', handleChange)
            return () => {
                minimap.removeEventListener('moveend', handleChange)
            };
        }
    }, [minimap, onCenterChange, circleFeature]);

    return minimap ? (
        <div style={{ height: '200px', marginBottom: '16px', position: 'relative' }}>
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
        </div>
    ) : null;
};
