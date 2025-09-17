const { execSync } = require('child_process');
const fs = require('fs');
const { dependencies } = require('../../build/app/package.json');
const webpackPaths = require('../configs/webpack.paths');

const rebuildModules = ['aktru-recorder-native', 'better-sqlite3'];

if (rebuildModules.length && Object.keys(dependencies || {}).length && fs.existsSync(webpackPaths.appNodeModulesPath)) {
  const electronRebuildCmd = `./node_modules/.bin/electron-rebuild --force --types dev --only ${rebuildModules.join(
    ',',
  )} --module-dir .`;
  const cmd = process.platform === 'win32' ? electronRebuildCmd.replace(/\//g, '\\') : electronRebuildCmd;
  execSync(cmd, {
    cwd: webpackPaths.rootPath,
    stdio: 'inherit',
  });
}
