const path = require('path');
const rimraf = require('rimraf');
const webpackPaths = require('../configs/webpack.paths');

function deleteSourceMaps() {
  rimraf.sync(path.join(webpackPaths.distMainPath, '*.js.map'), { glob: true });
  rimraf.sync(path.join(webpackPaths.distRendererPath, '*.js.map'), { glob: true });
}

module.exports = deleteSourceMaps;
