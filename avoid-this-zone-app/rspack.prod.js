const path = require('path');
const rspack = require('@rspack/core');
const { merge } = require('webpack-merge');
const dotenv = require('dotenv');

const common = require('./rspack.common.js');

// Load variables from .env into process.env
dotenv.config();

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'resources', 'public'),
          to: '.',
        },
      ],
    }),
    // Add DefinePlugin for environment variables
    new rspack.DefinePlugin({
      'process.env.REACT_APP_FIREBASE_API_KEY': JSON.stringify(process.env.REACT_APP_FIREBASE_API_KEY),
      'process.env.REACT_APP_FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN),
      'process.env.REACT_APP_FIREBASE_PROJECT_ID': JSON.stringify(process.env.REACT_APP_FIREBASE_PROJECT_ID),
      'process.env.REACT_APP_FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.REACT_APP_FIREBASE_STORAGE_BUCKET),
      'process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID),
      'process.env.REACT_APP_FIREBASE_APP_ID': JSON.stringify(process.env.REACT_APP_FIREBASE_APP_ID),
      'process.env.REACT_APP_FIREBASE_MEASUREMENT_ID': JSON.stringify(process.env.REACT_APP_FIREBASE_MEASUREMENT_ID),
    }),
  ].filter(Boolean),
  output: {
    filename: '[name].[contenthash].js',
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
  },
});
