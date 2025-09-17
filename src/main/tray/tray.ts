import { app, Tray } from 'electron';
import i18n from 'i18next';
import { DEFAULT_TRAY_ICON_DARK, DEFAULT_TRAY_ICON_LIGHT, RECORDING_TRAY_ICON } from '_main/constants';
import { SystemTheme, TrayIcon } from '_main/enums';
import { getAssetPath, getSystemTheme, logAndQuitWithErrorBox } from '_main/utils';
import { windowManager } from '_main/window-manager';
import { START_MINIMIZED } from '_shared/constants';
import log from 'electron-log';
import { TrayMenuBuilder } from './TrayMenuBuilder';

const logger = log.scope('Tray');

let tray: Tray;

function getIconAsset(icon: TrayIcon): string {
  logger.debug(`Set tray icon to ${icon}`);
  switch (icon) {
    case TrayIcon.Recording:
      return getAssetPath(RECORDING_TRAY_ICON);
    default:
      return getAssetPath(getSystemTheme() === SystemTheme.Light ? DEFAULT_TRAY_ICON_DARK : DEFAULT_TRAY_ICON_LIGHT);
  }
}

export function initTray() {
  logger.info('Initialize tray');
  tray = new Tray(getIconAsset(TrayIcon.Default));
  tray.setToolTip(`${i18n.t('app.name')} ${app.getVersion()}`);
  tray.setContextMenu(TrayMenuBuilder.buildMenu());
  tray.on('click', () => {
    logger.info('Open window from tray.');
    windowManager.showCurrentOrOpenDefaultWindow().catch(logAndQuitWithErrorBox);
  });
  if (START_MINIMIZED) {
    logger.info('Starting minimized app.');
    tray.displayBalloon({
      title: i18n.t('app.name'),
      content: i18n.t('app.tray.balloon.runningInBackground'),
    });
  }
}

export function setTrayIcon(icon: TrayIcon) {
  tray?.setImage(getIconAsset(icon));
}

export const getTray = () => tray;
