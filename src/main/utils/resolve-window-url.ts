import { URL } from 'url';
import path from 'path';
import { IS_DEV } from '_shared/constants';
import { WindowRoute } from '_shared/enums';

const rendererDirName = 'renderer';
const htmlFileName = 'index.html';

export function resolveWindowUrl(route: WindowRoute): string {
  let url;

  if (IS_DEV) {
    const port = process.env.PORT || 1212;
    url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
  } else {
    url = new URL(`file://${path.resolve(__dirname, `../${rendererDirName}/`, htmlFileName)}`);
  }

  if (route) {
    url.hash = route;
  }

  return url.href;
}
