/*******************************************************************************
 * setupMap.ts
 * -----------------------------------------------------------------------------
 * Configurable OpenLayers initialization for Avoid‑This‑Zone.
 * Reads defaults from .env (prefixed with REACT_APP_) but falls back to
 * hard‑coded sane values so development still works out‑of‑the‑box.
 */

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

/* ---------------------------------------------------------------------------
   Helper to coerce a string env var → number with a fallback
--------------------------------------------------------------------------- */
const numOr = (val: string | undefined, fallback: number): number =>
  val !== undefined && val !== '' ? Number(val) : fallback;

/* ---------------------------------------------------------------------------
   Pull env vars individually so EnvironmentPlugin can replace each reference.
   (Rspack/webpack stringify every `process.env.X` during build; destructuring
    an object breaks that replacement.)
--------------------------------------------------------------------------- */
const ARCGIS_GA_DISTRICTS_URL =
  process.env.REACT_APP_ARCGIS_GA_DISTRICTS_URL ??
  'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_119th_Congressional_Districts_no_territories/FeatureServer/0/query';

const centerLon = numOr(process.env.REACT_APP_MAP_CENTER_LON, -84.3880);
const centerLat = numOr(process.env.REACT_APP_MAP_CENTER_LAT, 33.7490);

const startZoom = numOr(process.env.REACT_APP_MAP_START_ZOOM, 9);
const minZoom = numOr(process.env.REACT_APP_MAP_MIN_ZOOM, 8);
const maxZoom = numOr(process.env.REACT_APP_MAP_MAX_ZOOM, 15);

const extent = process.env.REACT_APP_GEORGIA_EXTENT
  ? (process.env.REACT_APP_GEORGIA_EXTENT.split(',').map(Number) as [
      number,
      number,
      number,
      number
    ])
  : ([-9542547.6, 3570998.9, -8992086.6, 4163886.7] as [
      number,
      number,
      number,
      number
    ]);

const arcGISFeatureServiceUrl = ARCGIS_GA_DISTRICTS_URL;

/* ---------------------------------------------------------------------------
   Main factory
--------------------------------------------------------------------------- */

/**
 * Creates and returns a ready‑configured `OlMap` instance.
 */
export default function setupMap(): OlMap {
  /* --- District style ---------------------------------------------------- */
  const districtStyle = new Style({
    stroke: new Stroke({ color: 'blue', width: 2 }),
    fill: new Fill({ color: 'rgba(0,0,255,0.1)' })
  });

  /* --- District source pulls GA polygons on‑demand ----------------------- */
  const districtSource = new VectorSource({
    format: new EsriJSON(),
    strategy: bbox,
    loader: async (extentBbox, _res, projection) => {
      const url = `${arcGISFeatureServiceUrl}?where=STATE_NAME='Georgia'&geometry=${encodeURIComponent(
        JSON.stringify({
          xmin: extentBbox[0],
          ymin: extentBbox[1],
          xmax: extentBbox[2],
          ymax: extentBbox[3],
          spatialReference: { wkid: 3857 }
        })
      )}&geometryType=esriGeometryEnvelope&inSR=3857&outFields=*&f=json`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const features = districtSource.getFormat()?.readFeatures(data, {
          featureProjection: projection
        });
        if (features?.length) {
          districtSource.addFeatures(features);
        }
      } catch (err) {
        Logger.error('Error loading GA district layer:', err);
      }
    },
    attributions: 'Esri, U.S. Census Bureau, House of Representatives'
  });

  const districtLayer = new VectorLayer({
    source: districtSource,
    style: districtStyle,
    properties: { name: 'Georgia Congressional Districts' }
  });

  /* --- Base layer -------------------------------------------------------- */
  const osmLayer = new OlLayerTile({
    source: new OlSourceOSM(),
    properties: { name: 'OpenStreetMap Basemap' }
  });

  /* --- View -------------------------------------------------------------- */
  const view = new OlView({
    projection: 'EPSG:3857',
    center: fromLonLat([centerLon, centerLat]),
    zoom: startZoom,
    minZoom,
    maxZoom,
    extent
  });

  /* --- Compose & return -------------------------------------------------- */
  return new OlMap({
    view,
    layers: [osmLayer, districtLayer],
    interactions: defaultInteractions(),
    controls: OlControlDefaults({ zoom: false })
  });
}
