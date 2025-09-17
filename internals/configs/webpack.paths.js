const path = require('path');

const rootPath = path.join(__dirname, '../..');

const assetsPath = path.join(rootPath, 'assets');
const dllPath = path.join(__dirname, '../dll');

const srcPath = path.join(rootPath, 'src');
const srcMainPath = path.join(srcPath, 'main');
const srcRendererPath = path.join(srcPath, 'renderer');
const srcSharedPath = path.join(srcPath, 'shared');
const srcLocalizationPath = path.join(srcSharedPath, 'localization');

const buildPath = path.join(rootPath, 'build');
const appPath = path.join(buildPath, 'app');
const appPackagePath = path.join(appPath, 'package.json');
const appNodeModulesPath = path.join(appPath, 'node_modules');

const distPath = path.join(appPath, 'dist');
const distMainPath = path.join(distPath, 'main');
const distRendererPath = path.join(distPath, 'renderer');

const releasePath = path.join(buildPath, 'release');

const apiTokensPath = path.join(rootPath, '.api-tokens.json');

// noinspection WebpackConfigHighlighting
module.exports = {
  rootPath,
  assetsPath,
  dllPath,
  srcPath,
  srcLocalizationPath,
  srcMainPath,
  srcRendererPath,
  srcSharedPath,
  buildPath,
  appPath,
  appPackagePath,
  appNodeModulesPath,
  distPath,
  distMainPath,
  distRendererPath,
  releasePath,
  apiTokensPath,
};
