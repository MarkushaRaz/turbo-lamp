import { BrowserWindowConstructorOptions } from 'electron';
import { WindowPosition } from '_main/enums';
import { WindowRoute } from '_shared/enums';

export interface WindowProperties extends BrowserWindowConstructorOptions {
  position?: WindowPosition;
  route: WindowRoute;
  keepState?: boolean;
}
