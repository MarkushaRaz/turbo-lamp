import path from 'path';
import { app } from 'electron';

const assetsDirName = 'assets';

export function getAssetPath(...paths: string[]): string {
  const resourcePath = app.isPackaged
    ? path.join(process.resourcesPath, assetsDirName)
    : path.join(__dirname, `../../../${assetsDirName}`);
  return path.join(resourcePath, ...paths);
}
