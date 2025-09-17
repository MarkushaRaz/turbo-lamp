const webpack = require('webpack');
const webpackPaths = require('./webpack.paths');
const { dependencies: externals } = require('../../build/app/package.json');

module.exports = {
  externals: [...Object.keys(externals || {})],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    library: {
      type: 'commonjs2',
    },
  },

  resolve: {
    alias: {
      _: webpackPaths.srcPath,
      _assets: webpackPaths.assetsPath,
      _localization: webpackPaths.srcLocalizationPath,
      _main: webpackPaths.srcMainPath,
      _renderer: webpackPaths.srcRendererPath,
      _shared: webpackPaths.srcSharedPath,
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
    new webpack.DefinePlugin({
      'process.env.FLUENTFFMPEG_COV': false,
    }),
  ],
};
