/* eslint global-require: off */

import { IS_PROD } from '_shared/constants';

export function installSourceMapSupport(): void {
  if (!IS_PROD) return;
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}
