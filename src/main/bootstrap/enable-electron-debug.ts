/* eslint global-require: off */

import { IS_DEV_OR_DEBUG } from '_shared/constants';

export function enableElectronDebug(): void {
  if (!IS_DEV_OR_DEBUG) return;
  require('electron-debug')({ showDevTools: false });
}
