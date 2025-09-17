import { WindowPosition } from '_main/enums';
import { WindowProperties } from '_main/types';
import { hasEntitlement } from '_main/utils';
import { Entitlement, WindowRoute } from '_shared/enums';
import { BaseWindow } from './BaseWindow';

const properties: WindowProperties = {
  width: 500,
  height: 350,
  position: WindowPosition.Center,
  route: WindowRoute.MainWindow,
  keepState: true,
};

export class MainWindow extends BaseWindow {
  constructor() {
    if (hasEntitlement(Entitlement.HasSystemAudioToggle)) properties.width = 580;
    super(properties);
  }
}
