import log from 'electron-log';
import { app, BrowserWindow, dialog } from 'electron';
import i18n from 'i18next';

const logger = log.scope('LogAndQuitWithError');

export function logAndQuitWithErrorBox(e: Error, currentWindow?: BrowserWindow) {
  logger.error(e.message, e);

  if (currentWindow) {
    dialog.showMessageBoxSync(currentWindow, {
      type: 'error',
      title: i18n.t('app.error.critical') as string,
      message: e.message,
    });
  } else {
    dialog.showErrorBox(i18n.t('app.error.critical'), e.message);
  }

  app.quit();
}
