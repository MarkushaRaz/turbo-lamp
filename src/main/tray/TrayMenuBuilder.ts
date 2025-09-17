import { app, Menu } from 'electron';
import i18n from 'i18next';
import { getAppTheme, getAssetPath, hasEntitlement } from '_main/utils';
import { DEFAULT_TRAY_ICON_DARK, DEFAULT_TRAY_ICON_LIGHT } from '_main/constants';
import { AppTheme } from '_main/enums';
import log from 'electron-log';
import { Entitlement } from '_shared/enums';
import { CommunicationWindow } from '../windows/CommunicationWindow';

const logger = log.scope('Tray');

function getIconAsset() {
  return getAssetPath(getAppTheme() === AppTheme.Light ? DEFAULT_TRAY_ICON_DARK : DEFAULT_TRAY_ICON_LIGHT);
}

export class TrayMenuBuilder {
  static buildMenu(): Menu {
    logger.debug('Build tray menu');

    const hasMeetEntitlements =
      hasEntitlement(Entitlement.CanUseMeetConferencing) || hasEntitlement(Entitlement.CanUseMeetBroadcasting);

    return Menu.buildFromTemplate([
      {
        label: i18n.t<string>('app.name'),
        type: 'normal',
        enabled: false,
        icon: getIconAsset(),
      },
      {
        label: i18n.t<string>('general.communication'),
        type: 'normal',
        enabled: true,
        visible: hasMeetEntitlements,
        click: () => {
          if (!CommunicationWindow.isOpen) {
            logger.info('Open conference window');
            CommunicationWindow.open('conference');
          }
        },
      },
      {
        type: 'separator',
      },
      {
        label: i18n.t<string>('app.tray.exit'),
        type: 'normal',
        click: () => {
          logger.info('Quit the application');
          app.quit();
        },
      },
    ]);
  }
}
