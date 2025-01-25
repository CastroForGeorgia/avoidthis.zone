import React from 'react';

import { Alert } from 'antd';
import ConfigProvider from 'antd/lib/config-provider';
import enGB from 'antd/lib/locale/en_GB';

import { defaults as OlControlDefaults } from 'ol/control';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import { defaults as defaultInteractions, DoubleClickZoom } from 'ol/interaction';

import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';

import Logger from '@terrestris/base-util/dist/Logger';

import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';

import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style } from 'ol/style';
import { Heatmap as HeatmapLayer } from 'ol/layer';

import App from './App';
import i18n from './i18n';
import { store } from './store/store';

import './index.less';
import { FeatureStoreProvider } from './store/FeatureStore';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// ----------------------------------
// 1) The function that creates and configures our default map
// ----------------------------------
async function setupDefaultMap(): Promise<OlMap> {
  // Define style for the congressional districts
  const districtStyle = new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 2
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  });

  // GeoJSON for Georgia’s Congressional Districts
  const arcGISGeoJSONUrl =
    'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_119th_Congressional_Districts_no_territories/FeatureServer/0/query?where=STATE_NAME=%27Georgia%27&outFields=*&f=geojson';

  const districtSource = new VectorSource({
    url: arcGISGeoJSONUrl,
    format: new GeoJSON(),
    attributions: 'Esri, U.S. Census Bureau, House of Representatives'
  });

  const districtLayer = new VectorLayer({
    source: districtSource,
    style: districtStyle,
    properties: {
      name: 'Georgia Congressional Districts'
    }
  });

  // Restrict map to (roughly) Georgia’s bounding box in EPSG:3857
  const georgiaExtent = [
    -9542547.6,
    3570998.9,
    -8992086.6,
    4163886.7
  ];

  // Basic OSM layer
  const osmLayer = new OlLayerTile({
    source: new OlSourceOSM(),
    properties: { name: 'OpenStreetMap Georgia' }
  });

  // Heatmap layer
  const heatmapSource = new VectorSource();
  const heatmapLayer = new HeatmapLayer({
    source: heatmapSource,
    blur: 10,
    radius: 5,
    weight: (feature) => feature.get('weight') || 1,
    properties: { name: 'Heatmap Layer' }
  });

  const interactions = defaultInteractions();
  // This includes a DoubleClickZoom instance by default

  // Find the DoubleClickZoom in the default set
  const dblClickZoom = interactions
    .getArray()
    .find((i) => i instanceof DoubleClickZoom) as DoubleClickZoom | undefined;

  if (dblClickZoom) {
    // Example: Listen for changes to the 'active' property
    dblClickZoom.on('change:active', () => {
      console.log('[DoubleClickZoom] active changed =>', dblClickZoom.getActive());
    });

    // Or listen to *any* property change
    dblClickZoom.on('propertychange', (evt) => {
      console.log('[DoubleClickZoom] property changed:', evt);
    });

    // Or a simple 'change' event (fired when *any* property or internal revision changes)
    dblClickZoom.on('change', () => {
      console.log('[DoubleClickZoom] something changed, current props:', dblClickZoom.getProperties());
    });

    // If you want to disable double-click zoom for now:
    // dblClickZoom.setActive(false);
  }
  // Create map with 3 layers (OSM, Districts, Heatmap)
  const map = new OlMap({
    view: new OlView({
      projection: 'EPSG:3857',
      center: fromLonLat([-83.5, 32.5]),
      zoom: 7,
      minZoom: 6,
      maxZoom: 14,
      extent: georgiaExtent
    }),
    interactions: interactions,
    layers: [osmLayer, districtLayer, heatmapLayer],
    controls: OlControlDefaults({
      zoom: true
    })
  });

  return map;
}

async function setupMap(): Promise<OlMap> {
  Logger.info('No application ID given, loading default map configuration.');
  return setupDefaultMap();
}

// Locale helper for antd
const getConfigLang = (lang: string) => enGB;

// ----------------------------------
// 2) The main render function
// ----------------------------------
async function renderApp() {
  const container = document.getElementById('app');
  if (!container) {
    Logger.error('Could not find container element with ID "app"');
    return;
  }

  // 1) Create a React root
  const root = createRoot(container);

  try {
    // 2) Setup our OpenLayers map
    const map = await setupMap();

    // 3) Render our React app, providing the map through MapContext
    root.render(
      <React.StrictMode>
        <React.Suspense fallback={<span></span>}>
          <HelmetProvider>
            <ConfigProvider locale={getConfigLang(i18n.language)}>
              <ReduxProvider store={store}>
                <MapContext.Provider value={map}>
                  <FeatureStoreProvider>
                    <Helmet>
                      <html lang="en" />
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
                      <meta name="twitter:card" content="summary_large_image" />
                      <meta name="twitter:title" content="Avoid This Zone - ICE Activity Tracker for Georgia" />
                      <meta name="twitter:description" content="Stay informed about ICE activity across Georgia with this interactive safety map." />
                      <meta name="twitter:image" content="path/to/your/optimized-image.png" />
                      <meta name="twitter:image:alt" content="Screenshot of the Avoid This Zone map highlighting ICE activity areas in Georgia." />
                      <link rel="canonical" href="https://avoidthis.zone" />
                    </Helmet>
                    <App />
                  </FeatureStoreProvider>
                </MapContext.Provider>
              </ReduxProvider>
            </ConfigProvider>
          </HelmetProvider>
        </React.Suspense>
      </React.StrictMode>
    );
  } catch (error) {
    Logger.error(error);

    // Fallback UI in case the map creation or anything else fails
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
}

renderApp();