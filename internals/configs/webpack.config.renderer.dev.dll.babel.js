const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.base');
const webpackPaths = require('./webpack.paths');
const { dependencies } = require('../../package.json');
const checkNodeEnv = require('../scripts/check-node-env');

checkNodeEnv('development');

const dist = webpackPaths.dllPath;

// noinspection JSCheckFunctionSignatures
module.exports = merge(baseConfig, {
  context: webpackPaths.rootPath,

  devtool: 'eval',

  mode: 'development',

  target: 'electron-renderer',

  externals: ['fsevents', 'crypto-browserify', 'osx-temperature-sensor', 'react-native-sqlite-storage'],

  module: require('./webpack.config.renderer.dev.babel').module,

  entry: {
    renderer: Object.keys(dependencies || {}),
  },

  output: {
    path: dist,
    filename: '[name].dev.dll.js',
    library: {
      name: 'renderer',
      type: 'var',
    },
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(dist, '[name].json'),
      name: '[name]',
    }),

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: webpackPaths.srcPath,
        output: {
          path: webpackPaths.dllPath,
        },
      },
    }),
  ],
});
