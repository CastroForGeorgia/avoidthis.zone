// src/components/FindMeComponent.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useMap } from '@terrestris/react-util';

import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { circular } from 'ol/geom/Polygon';
import { fromLonLat } from 'ol/proj';
import Control from 'ol/control/Control';

import { AimOutlined } from '@ant-design/icons';
import { createRoot } from 'react-dom/client';

/**
 * FindMeComponent
 *
 * This component adds a vector layer to the map to display the user's current
 * position (as a point) and an accuracy circle around it. It also provides a
 * locate control using an Ant Design icon. Geolocation permissions are only
 * requested after the user clicks the locate button.
 */
const FindMeComponent: React.FC = () => {
    const map = useMap();
    // "tracking" state indicates if we have started watching the user's position.
    const [tracking, setTracking] = useState(false);

    // Create the vector layer that will hold the user's location features.
    const [findMeLayer] = useState(() => {
        const source = new VectorSource();
        const layer = new VectorLayer({
            source: source,
        });
        return layer;
    });

    // Add the findMeLayer to the map when the component mounts.
    useEffect(() => {
        if (!map) return;
        map.addLayer(findMeLayer);
        return () => {
            map.removeLayer(findMeLayer);
        };
    }, [map, findMeLayer]);

    // Define the locate button click handler.
    // - If not already tracking, it starts tracking (and thus requests permission).
    // - Otherwise, if a location is available, it centers the map on it.
    const handleLocateClick = useCallback(() => {
        if (!map) return;
        if (!tracking) {
            setTracking(true);
            return;
        }
        const source = findMeLayer.getSource();
        if (source && !source.isEmpty()) {
            map.getView().fit(source.getExtent(), {
                maxZoom: 18,
                duration: 500,
            });
        }
    }, [map, tracking, findMeLayer]);

    // Add the locate control to the map using an Ant Design icon and React 18's createRoot.
    useEffect(() => {
        if (!map) return;
        const locateControlDiv = document.createElement('div');
        locateControlDiv.className = 'ol-control ol-unselectable locate';

        // Use createRoot to render the React element into the control container.
        const root = createRoot(locateControlDiv);
        root.render(
            <div onClick={handleLocateClick} style={{ cursor: 'pointer', padding: '5px' }}>
                <AimOutlined style={{ fontSize: '24px' }} />
            </div>
        );

        const locateControl = new Control({
            element: locateControlDiv,
        });
        map.addControl(locateControl);

        return () => {
            map.removeControl(locateControl);
            // Defer the unmount to avoid synchronous unmount issues.
            setTimeout(() => {
                root.unmount();
            }, 0);
        };
    }, [map, handleLocateClick]);

    // When tracking is enabled, start watching the user's position.
    useEffect(() => {
        if (!map || !tracking) return;
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const coords = [pos.coords.longitude, pos.coords.latitude];
                // Create an accuracy circle using the reported accuracy.
                const accuracyCircle = circular(coords, pos.coords.accuracy);
                accuracyCircle.transform('EPSG:4326', map.getView().getProjection());
                const accuracyFeature = new Feature(accuracyCircle);
                const positionFeature = new Feature(new Point(fromLonLat(coords)));
                const source = findMeLayer.getSource();
                // Clear any old features and add the new ones.
                source?.clear();
                source?.addFeatures([accuracyFeature, positionFeature]);
            },
            (error) => {
                alert(`ERROR: ${error.message}`);
            },
            { enableHighAccuracy: true }
        );
        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [map, tracking, findMeLayer]);

    // This component doesn't render any visible React elements by itself.
    return null;
};

export default FindMeComponent;
