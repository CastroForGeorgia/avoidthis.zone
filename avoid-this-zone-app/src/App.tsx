import React, { useEffect, useState } from 'react';
import { Layout, Drawer, Button, Spin, Result } from 'antd';
import BasicMapComponent from './components/BasicMapComponent';
import FiltersDrawer from './components/FiltersDrawer';
import ResultsPanel from './components/ResultsPanel';
import './App.less';
import { Logger } from '@terrestris/base-util';
import EsriJSON from 'ol/format/EsriJSON';
import VectorLayer from 'ol/layer/Vector';
import { bbox } from 'ol/loadingstrategy';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke, Fill } from 'ol/style';
import { defaults as OlControlDefaults } from 'ol/control';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import { defaults as defaultInteractions } from 'ol/interaction';
import { MapContext } from '@terrestris/react-util';
import { SettingOutlined } from '@ant-design/icons';
import { signInAnonymouslyIfNeeded } from './firebase';
import { AppDataProvider } from './providers/AppDataContextProvider';
import { HeatMapComponent } from './components/HeatMapComponent/HeatMapComponent';

const { Content } = Layout;

function setupMap(): OlMap {
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

  const districtSource = new VectorSource({
    format: new EsriJSON(),
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

  const georgiaExtent = [-9542547.6, 3570998.9, -8992086.6, 4163886.7];

  const osmLayer = new OlLayerTile({
    source: new OlSourceOSM(),
    properties: { name: 'OpenStreetMap Georgia' },
  });

  const interactions = defaultInteractions();

  const map = new OlMap({
    view: new OlView({
      projection: 'EPSG:3857',
      center: fromLonLat([-84.3880, 33.7490]),
      zoom: 10,
      minZoom: 8,
      maxZoom: 15,
      extent: georgiaExtent,
    }),
    interactions,
    layers: [osmLayer, districtLayer],
    controls: OlControlDefaults({ zoom: true }),
  });

  return map;
}

export const App: React.FC = (): JSX.Element => {
  const [map, setMap] = useState<OlMap | null>(null);
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  // Loading and error states for the entire app
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const olMap = setupMap();
        setMap(olMap);
        await signInAnonymouslyIfNeeded();
      } catch (err) {
        Logger.error('Error initializing app:', err);
        setError('Failed to load application. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // 1) If loading, show the default Ant spinner
  if (loading) {
    return (
      <Layout className="app-layout">
        <Content className="spin-container">
          <Spin tip="Loading..." size="large" />
        </Content>
      </Layout>
    );
  }

  // 2) If error, show the default Ant Result component
  if (error) {
    return (
      <Layout className="app-layout">
        <Content className="error-container">
          <Result
            status="error"
            title="Application Error"
            subTitle={error}
          />
        </Content>
      </Layout>
    );
  }

  // 3) Otherwise, show your normal layout
  return (
    <MapContext.Provider value={map}>
      <AppDataProvider>
      
        <Layout className="app-layout">
          <Content className="map-container">
            <BasicMapComponent />
            <HeatMapComponent />
          </Content>

          <div className="results-panel">
            <ResultsPanel />
          </div>

          <Button
            className="filters-button"
            type="primary"
            shape="circle"
            icon={<SettingOutlined />}
            onClick={() => setDrawerVisible(true)}
          />

          <Drawer
            className="filters-drawer"
            placement="bottom"
            closable
            height="50vh"
            open={isDrawerVisible}
            onClose={() => setDrawerVisible(false)}
          >
            <FiltersDrawer />
          </Drawer>
        </Layout>
      </AppDataProvider>
    </MapContext.Provider>
  );
};

export default App;
