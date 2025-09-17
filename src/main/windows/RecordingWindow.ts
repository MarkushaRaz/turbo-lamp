import { WindowPosition } from '_main/enums';
import { getSettings } from '_main/providers';
import { WindowProperties } from '_main/types';
import { hasEntitlement } from '_main/utils';
import { Entitlement, WindowRoute } from '_shared/enums';
import { IS_WINDOWS } from '_shared/constants';
import { BaseWindow } from './BaseWindow';

const properties: WindowProperties = {
  width: 310,
  height: 684,
  position: WindowPosition.BottomRight,
  route: WindowRoute.RecordingWindow,
  alwaysOnTop: true,
};

export class RecordingWindow extends BaseWindow {
  constructor() {
    if (hasEntitlement(Entitlement.CanMuteAudio)) {
      properties.width = IS_WINDOWS ? 360 : 335;
    }
    super(properties);
  }

  init(): Promise<void> {
    const contentProtectionEnabled = !getSettings().contentProtectionDisabled;
    return super.init().then(() => this.browserWindow?.setContentProtection(contentProtectionEnabled));
  }

  hide() {
    this.minimize();
  }

  bringToFront() {
    // Do nothing. The window is already set to be always on top
  }
}
