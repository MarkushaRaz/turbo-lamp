/* eslint global-require: off, no-console: off, consistent-return: off */
import { IS_DEV_OR_DEBUG } from '_shared/constants';

export async function installExtensions(): Promise<string | void> {
  if (!IS_DEV_OR_DEBUG) return;

  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
}
