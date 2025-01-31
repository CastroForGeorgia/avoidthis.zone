// src/index.ts

import React, { useEffect, useState } from 'react';
import { Alert, Spin } from 'antd';
import ConfigProvider from 'antd/lib/config-provider';
import enUS from 'antd/lib/locale/en_US';
import { defaults as OlControlDefaults } from 'ol/control';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import { defaults as defaultInteractions } from 'ol/interaction';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import Logger from '@terrestris/base-util/dist/Logger';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import EsriJSON from 'ol/format/EsriJSON';
import { Fill, Stroke, Style } from 'ol/style';
import App from './App';
import i18n from './i18n';
import { store } from './store/store';
import './index.less';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { bbox } from 'ol/loadingstrategy';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { HeatmapStoreProvider } from './store/HeatmapStore';
import { signInAnonymouslyIfNeeded } from './firebase';
import { AppDataProvider } from './providers/AppDataContextProvider';

// ----------------------------------
// 1) The function that creates and configures our default map with dynamic loading
// ----------------------------------
async function setupDefaultMap(): Promise<OlMap> {
  // Define style for the congressional districts
  const districtStyle = new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)',
    }),
  });

  // ArcGIS REST Feature Service URL for Georgia’s Congressional Districts
  const arcGISFeatureServiceUrl =
    'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_119th_Congressional_Districts_no_territories/FeatureServer/0/query';

  // Configure the Vector Source to load features based on map extent
  const districtSource = new VectorSource({
    format: new EsriJSON(),
    // Use bbox strategy to load features within the current map extent
    strategy: bbox,
    loader: async (extent, resolution, projection) => {
      const url = `${arcGISFeatureServiceUrl}?where=STATE_NAME='Georgia'&geometry=${encodeURIComponent(
        JSON.stringify({
          xmin: extent[0],
          ymin: extent[1],
          xmax: extent[2],
          ymax: extent[3],
          spatialReference: { wkid: 3857 },
        })
      )}&geometryType=esriGeometryEnvelope&inSR=3857&outFields=*&f=json`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const features = districtSource.getFormat()?.readFeatures(data, {
          featureProjection: projection,
        });
        if (features) {
          districtSource.addFeatures(features);

        }
      } catch (error) {
        Logger.error('Error loading district features:', error);
      }
    },
    attributions: 'Esri, U.S. Census Bureau, House of Representatives',
  });

  const districtLayer = new VectorLayer({
    source: districtSource,
    style: districtStyle,
    properties: {
      name: 'Georgia Congressional Districts',
    },
  });

  // Restrict map to (roughly) Georgia’s bounding box in EPSG:3857
  const georgiaExtent = [
    -9542547.6,
    3570998.9,
    -8992086.6,
    4163886.7,
  ];

  // Basic OSM layer
  const osmLayer = new OlLayerTile({
    source: new OlSourceOSM(),
    properties: { name: 'OpenStreetMap Georgia' },
  });

  // Initialize interactions and modify if needed
  const interactions = defaultInteractions();

  // Create map with 3 layers (OSM, Districts, Heatmap)
  const map = new OlMap({
    view: new OlView({
      projection: 'EPSG:3857',
      center: fromLonLat([-84.3880, 33.7490]), // Updated center to Atlanta coordinates
      zoom: 10, // Updated zoom level for Atlanta metro area
      minZoom: 8,
      maxZoom: 15,
      extent: georgiaExtent,
    }),
    interactions: interactions,
    layers: [osmLayer, districtLayer],
    controls: OlControlDefaults({
      zoom: true,
    }),
  });

  return map;
}

async function setupMap(): Promise<OlMap> {
  Logger.info('No application ID given, loading default map configuration.');
  return setupDefaultMap();
}

// Locale helper for antd
const getConfigLang = (lang: string) => enUS;

// ----------------------------------
// 2) The main render function
// ----------------------------------
const AppLoader = () => {
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState<OlMap | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await signInAnonymouslyIfNeeded(); // Authenticate the user
        const loadedMap = await setupMap(); // Load the map
        setMap(loadedMap);
      } catch (err) {
        Logger.error("Error initializing app:", err);
        setError("Failed to load application. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Initializing application..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        className="error-boundary"
        message="Application Error"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  return (
    <React.StrictMode>
      <HelmetProvider>
        <ConfigProvider locale={enUS}>
          <ReduxProvider store={store}>
            <MapContext.Provider value={map}>
              <HeatmapStoreProvider map={map}>
                <Helmet>
                  <html lang={i18n.language} />
                  <title>Avoid This Zone - ICE Activity Tracker for Georgia</title>
                  <meta name="description" content="Stay informed with 'Avoid This Zone,' an interactive map tracking ICE activity and providing safety alerts across Georgia. Protect your community today." />
                  <meta name="keywords" content="Georgia ICE tracker, ICE activity map, avoid ICE zones, community safety, Georgia heatmap, local immigration alerts, interactive map, OpenLayers, React" />
                  <meta name="author" content="Andres Castro" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <meta property="og:title" content="Avoid This Zone - ICE Activity Tracker for Georgia" />
                  <meta property="og:description" content="Explore ICE activity and safety zones on an interactive map tailored for Georgia residents. Stay safe and protect your community." />
                  <meta property="og:image" content="path/to/your/optimized-image.png" />
                  <meta property="og:image:alt" content="Screenshot of the Avoid This Zone map highlighting ICE activity areas in Georgia." />
                  <meta property="og:type" content="website" />
                  <meta property="og:url" content="https://avoidthis.zone" />
                  <link rel="canonical" href="https://avoidthis.zone" />
                </Helmet>
                <AppDataProvider>
                  <App />
                </AppDataProvider>
              </HeatmapStoreProvider>
            </MapContext.Provider>
          </ReduxProvider>
        </ConfigProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
};

// ----------------------------------
// 2) The main render function
// ----------------------------------
function renderApp() {
  const container = document.getElementById('app');
  if (!container) {
    Logger.error('Could not find container element with ID "app"');
    return;
  }

  const root = createRoot(container);
  root.render(<AppLoader />);
}

renderApp();