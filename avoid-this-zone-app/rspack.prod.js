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
