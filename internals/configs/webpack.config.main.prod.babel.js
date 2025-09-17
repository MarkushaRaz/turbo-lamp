const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { encryptFpsToken } = require('aktru-recorder-native');
const { uuid } = require('../../package.json');
const baseConfig = require('./webpack.config.base');
const webpackPaths = require('./webpack.paths');
const checkNodeEnv = require('../scripts/check-node-env');
const deleteSourceMaps = require('../scripts/delete-source-maps');
const exitWithError = require('../scripts/exit-with-error');

/**
 * @type {{fpsToken: string}}
 */
const apiTokens = require(webpackPaths.apiTokensPath);

if (!apiTokens.fpsToken) {
  exitWithError('Fingerprint Service Token is empty or missing! Please set it in .api-tokens.json');
}

checkNodeEnv('production');
deleteSourceMaps();

const devtoolsConfig =
  process.env.DEBUG_PROD === 'true'
    ? {
        devtool: 'source-map',
      }
    : {};

// noinspection JSCheckFunctionSignatures,JSUnusedGlobalSymbols
module.exports = merge(baseConfig, {
  ...devtoolsConfig,

  mode: 'production',

  target: 'electron-main',

  entry: {
    'main.prod': path.join(webpackPaths.srcMainPath, 'main.ts'),
  },

  externals: [
    '@google-cloud/spanner',
    '@sap/hana-client',
    'better-sqlite3',
    'hdb-pool',
    'ioredis',
    'mongodb',
    'mssql',
    'mysql',
    'mysql2',
    'oracledb',
    'osx-temperature-sensor',
    'pg',
    'pg-native',
    'pg-query-stream',
    'react-native-sqlite-storage',
    'redis',
    'sqlite3',
    'sql.js',
    'typeorm-aurora-data-api-driver',
  ],

  output: {
    path: webpackPaths.distMainPath,
    filename: '[name].js',
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          keep_classnames: true,
        },
      }),
    ],
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true',
    }),

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false,
    }),

    new webpack.DefinePlugin({
      FPS_API_TOKEN: JSON.stringify(encryptFpsToken(apiTokens.fpsToken)),
      UUID: JSON.stringify(uuid),
    }),
  ],

  node: {
    __dirname: false,
    __filename: false,
  },
});
