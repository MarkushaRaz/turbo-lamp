const webpackPaths = require('../configs/webpack.paths');

require('@babel/register')({
  extensions: ['.es6', '.es', '.jsx', '.js', '.mjs', '.ts', '.tsx'],
  cwd: webpackPaths.rootPath,
});
