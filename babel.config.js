/* eslint global-require: off, import/no-extraneous-dependencies: off */
const { encryptFpsToken } = require('aktru-recorder-native');
const webpackPaths = require('./internals/configs/webpack.paths');
const exitWithError = require('./internals/scripts/exit-with-error');
const { uuid } = require('./package.json');
/**
 * @type {{fpsToken: string}}
 */
// eslint-disable-next-line import/no-dynamic-require
const apiTokens = require(webpackPaths.apiTokensPath);

if (!apiTokens.fpsToken) {
  exitWithError('Fingerprint Service Token is empty or missing! Please set it in .api-tokens.json');
}

const developmentEnvironments = ['development', 'test'];
const developmentPlugins = [
  [require('babel-plugin-global-define'), { FPS_API_TOKEN: encryptFpsToken(apiTokens.fpsToken), UUID: uuid }],
  require('@babel/plugin-transform-runtime'),
  [
    require.resolve('babel-plugin-module-resolver'),
    {
      root: ['./src'],
      alias: {
        _assets: './assets',
        _localization: './src/shared/localization',
        _main: './src/main',
        _renderer: './src/renderer',
        _shared: './src/shared',
      },
    },
  ],
];
const productionPlugins = [
  require('babel-plugin-dev-expression'),
  require('@babel/plugin-transform-modules-commonjs'),
  require('@babel/plugin-transform-react-constant-elements'),
  require('@babel/plugin-transform-react-inline-elements'),
  require('babel-plugin-transform-react-remove-prop-types'),
];

module.exports = (api) => {
  const development = api.env(developmentEnvironments);

  return {
    presets: [
      require('@babel/preset-env'),
      require('@babel/preset-typescript'),
      [require('@babel/preset-react'), { development }],
    ],
    plugins: [
      [
        require('babel-plugin-import'),
        {
          camel2DashComponentName: false,
          libraryDirectory: '',
          libraryName: 'kaltura-typescript-client/api/types',
          transformToDefaultImport: false,
        },
      ],
      [require('babel-plugin-direct-import'), { modules: ['@mui/material', '@mui/icons-material', 'lodash'] }],
      require('babel-plugin-lodash'),
      require('@babel/plugin-proposal-function-bind'),
      require('@babel/plugin-proposal-export-default-from'),
      require('@babel/plugin-proposal-logical-assignment-operators'),
      require('@babel/plugin-proposal-object-rest-spread'),
      require('@babel/plugin-proposal-optional-chaining'),
      [require('@babel/plugin-proposal-pipeline-operator'), { proposal: 'minimal' }],
      require('@babel/plugin-proposal-nullish-coalescing-operator'),
      require('@babel/plugin-proposal-do-expressions'),
      require('babel-plugin-transform-typescript-metadata'),
      [require('@babel/plugin-proposal-decorators'), { legacy: true }],
      require('@babel/plugin-proposal-function-sent'),
      require('@babel/plugin-proposal-export-namespace-from'),
      require('@babel/plugin-proposal-numeric-separator'),
      require('@babel/plugin-proposal-throw-expressions'),
      require('@babel/plugin-syntax-dynamic-import'),
      require('@babel/plugin-syntax-import-meta'),
      [require('@babel/plugin-proposal-class-properties')],
      require('@babel/plugin-proposal-json-strings'),
      require('babel-plugin-styled-components'),
      [
        require('babel-plugin-i18next-extract'),
        {
          locales: ['en', 'ru'],
          outputPath: 'src/shared/localization/locales/{{locale}}/{{ns}}.json',
        },
      ],
      ...(development ? developmentPlugins : productionPlugins),
    ],
  };
};
