const path = require('path');
const ReactRefreshPlugin = require('@rspack/plugin-react-refresh');
const { merge } = require('webpack-merge');
const { EnvironmentPlugin } = require('@rspack/core'); // Rspack-compatible EnvironmentPlugin
const dotenv = require('dotenv');

const common = require('./rspack.common.js');

// Load variables from .env into process.env
dotenv.config({ path: '.env.local'});
// dotenv.config();

// -----------------------------------------------------------------------------
// Dynamically build DefinePlugin mapping to avoid repeating JSON.stringify()
// -----------------------------------------------------------------------------
/** List of environment keys we want exposed to the browser */
const RUNTIME_ENV_KEYS = [
  // Firebase
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID',
  'REACT_APP_FIREBASE_MEASUREMENT_ID',

  // Supabase
  'REACT_APP_SUPABASE_URL',
  'REACT_APP_SUPABASE_ANON',

  // Map configuration
  'REACT_APP_ARCGIS_GA_DISTRICTS_URL',
  'REACT_APP_MAP_CENTER_LON',
  'REACT_APP_MAP_CENTER_LAT',
  'REACT_APP_MAP_START_ZOOM',
  'REACT_APP_MAP_MIN_ZOOM',
  'REACT_APP_MAP_MAX_ZOOM',
  'REACT_APP_GEORGIA_EXTENT'
];

if (process.env.DEBUG_ENV === 'true') {
  console.table(RUNTIME_ENV_KEYS.map(k => ({ key: `process.env.${k}`, value: process.env[k] })));
}

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    server: 'https',
    hot: true,
    static: path.join(__dirname, 'resources', 'public'),
  },
  plugins: [
    new ReactRefreshPlugin(),
    // Inject environment variables (Firebase, Supabase, Map)
    new EnvironmentPlugin(RUNTIME_ENV_KEYS),
  ],
});
