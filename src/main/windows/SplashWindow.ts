import { WindowPosition } from '_main/enums';
import { WindowProperties } from '_main/types';
import { WindowRoute } from '_shared/enums';
import { BaseWindow } from './BaseWindow';

const properties: WindowProperties = {
  width: 440,
  height: 228,
  position: WindowPosition.Center,
  route: WindowRoute.SplashWindow,
};

export class SplashWindow extends BaseWindow {
  constructor() {
    super(properties);
  }
}
