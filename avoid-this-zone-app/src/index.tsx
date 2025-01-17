import React from 'react';

import {
  Alert,
  notification
} from 'antd';

import ConfigProvider from 'antd/lib/config-provider';
import enGB from 'antd/lib/locale/en_GB';

import {
  defaults as OlControlDefaults
} from 'ol/control';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import {
  fromLonLat
} from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';

import {
  createRoot
} from 'react-dom/client';
import {
  Provider
} from 'react-redux';

import Logger from '@terrestris/base-util/dist/Logger';

import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';

import App from './App';
import i18n from './i18n';
import {
  store
} from './store/store';

import './index.less';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Fill, Stroke, Style } from 'ol/style';
import { Heatmap as HeatmapLayer, Tile as TileLayer } from 'ol/layer.js';
import { Feature } from 'ol';
import { Point } from 'ol/geom';

const getConfigLang = (lang: string) => enGB;

const setupDefaultMap = async () => {
  // Define the style for the congressional districts
  const districtStyle = new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)',
    }),
  });

  // Corrected URL for the GeoJSON query
  const arcGISGeoJSONUrl =
    'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_119th_Congressional_Districts_no_territories/FeatureServer/0/query?where=STATE_NAME=%27Georgia%27&outFields=*&f=geojson';

  const districtSource = new VectorSource({
    url: arcGISGeoJSONUrl,
    format: new GeoJSON(),
    attributions: 'Esri, U.S. Census Bureau, House of Representatives',
  });

  const districtLayer = new VectorLayer({
    source: districtSource,
    style: districtStyle,
    properties: {
      name: 'Georgia Congressional Districts',
    },
  });

  const georgiaExtent = [
    -9542547.6, // Min X (SW corner longitude in EPSG:3857)
    3570998.9,  // Min Y (SW corner latitude in EPSG:3857)
    -8992086.6, // Max X (NE corner longitude in EPSG:3857)
    4163886.7,  // Max Y (NE corner latitude in EPSG:3857)
  ];

  const osmLayer = new OlLayerTile({
    source: new OlSourceOSM(),
    properties: {
      name: 'OpenStreetMap Georgia',
    },
  });

  // Create the heatmap source and layer
  const heatmapSource = new VectorSource();

  const heatmapLayer = new HeatmapLayer({
    source: heatmapSource,
    blur: 10,
    radius: 5,
    weight: (feature) => feature.get('weight') || 1,
    properties: {
      name: 'Heatmap Layer',
    },
  });

  const map = new OlMap({
    view: new OlView({
      projection: 'EPSG:3857',
      center: fromLonLat([-83.5, 32.5]), // Centered on Georgia
      zoom: 7,
      minZoom: 6,
      maxZoom: 14,
      extent: georgiaExtent, // Restrict map extent to Georgia
    }),
    layers: [osmLayer, districtLayer, heatmapLayer], // Include heatmap layer
    controls: OlControlDefaults({
      zoom: true,
    }),
  });

  const addDynamicFeatures = () => {
    const numFeaturesPerDistrict = 1; // Number of features to add per district
    const districtFeatures = districtSource.getFeatures(); // Get Georgia district features

    if (districtFeatures.length === 0) {
      console.warn('District features not yet loaded.');
      return;
    }

    districtFeatures.forEach((districtFeature) => {
      const districtGeometry = districtFeature.getGeometry(); // Get the geometry for the district

      if (!districtGeometry) {
        console.warn('District feature has no geometry.');
        return;
      }

      for (let i = 0; i < numFeaturesPerDistrict; i++) {
        let isValidPoint = false;
        let coordinates: number[]; // Ensure it's always defined

        while (!isValidPoint) {
          // Generate a random point within the bounding box of the district
          const extent = districtGeometry.getExtent();
          const lon = extent[0] + Math.random() * (extent[2] - extent[0]); // Random longitude within district bounds
          const lat = extent[1] + Math.random() * (extent[3] - extent[1]); // Random latitude within district bounds
          coordinates = [lon, lat]; // Always assign a value to coordinates

          // Check if the point is within the district geometry
          if (districtGeometry.intersectsCoordinate(coordinates)) {
            isValidPoint = true;
          }
        }

        const feature = new Feature({
          geometry: new Point(coordinates),
          weight: Math.random() * 9 + 1, // Random weight between 1 and 10
        });

        heatmapSource.addFeature(feature);
      }
    });
  };

  // Add features dynamically over time
  setInterval(() => {
    addDynamicFeatures();
  }, 500); // Add new features every 2 seconds

  return map;
};

const setupMap = async () => {
  const applicationId = new URLSearchParams(window.location.search).get('applicationId');

  if (applicationId) {
    Logger.info(`Loading application with ID ${applicationId}`);
    return await setupSHOGunMap(parseInt(applicationId, 10));
  }

  Logger.info('No application ID given, loading default map configuration.');
  return setupDefaultMap();
};

const setupSHOGunMap = async (applicationId: number) => {
  Logger.info(`SHOGun map setup is not currently implemented.`);
  return setupDefaultMap();
};

const renderApp = async () => {
  const container = document.getElementById('app');

  if (!container) {
    Logger.error('Could not find container element with ID "app"');
    return;
  }

  const root = createRoot(container);

  try {
    const map = await setupMap();

    root.render(
      <React.StrictMode>
        <React.Suspense fallback={<span></span>}>
          <ConfigProvider locale={getConfigLang(i18n.language)}>
            <Provider store={store}>
              <MapContext.Provider value={map}>
                <App />
              </MapContext.Provider>
            </Provider>
          </ConfigProvider>
        </React.Suspense>
      </React.StrictMode>
    );
  } catch (error) {
    Logger.error(error);

    root.render(
      <React.StrictMode>
        <Alert
          className="error-boundary"
          message={i18n.t('Index.errorMessage')}
          description={i18n.t('Index.errorDescription')}
          type="error"
          showIcon
        />
      </React.StrictMode>
    );
  }
};

renderApp();