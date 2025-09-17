import { WindowPosition } from '_main/enums';
import { WindowProperties } from '_main/types';
import { WindowRoute } from '_shared/enums';
import { BaseWindow } from './BaseWindow';

const properties: WindowProperties = {
  width: 800,
  height: 600,
  position: WindowPosition.Center,
  route: WindowRoute.DashboardWindow,
};

export class DashboardWindow extends BaseWindow {
  constructor() {
    super(properties);
  }
}
