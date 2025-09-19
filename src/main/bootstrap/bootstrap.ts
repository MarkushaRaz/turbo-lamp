/* eslint no-console: off */

import { app } from 'electron';
import { initialize as initializeRemote } from '@electron/remote/main';
import i18next from 'i18next';
import i18nextOptions from '_localization/i18.config';
import { getSettings } from '_main/providers';
import log from 'electron-log';
import { setCertificateVerifyProc } from '_main/bootstrap/set-certificate-verify-proc';
import { PulseAudioInstaller } from '_main/services/pulseaudio-service';
import { IS_WINDOWS } from '_shared/constants';
import { appendSwitches } from './append-switches';
import { installSourceMapSupport } from './install-source-map-support';
import { enableElectronDebug } from './enable-electron-debug';
import { ensureAutorun } from './autorun';
import { installExtensions } from './install-extentions';
import { wireUpLifeCycleEventHandlers } from './lifecycle';

const logger = log.scope('Bootstrap');

export function bootstrap(): Promise<void> {
  logger.info('Bootstrapping the application');
  appendSwitches();
  initializeRemote();
  installSourceMapSupport();
  enableElectronDebug();
  i18next.init(i18nextOptions).catch(console.log);
  wireUpLifeCycleEventHandlers();
  ensureAutorun();
  if (getSettings().contentProtectionDisabled) {
    app.disableHardwareAcceleration();
  }
  app.setAppUserModelId(i18next.t('app.name'));
  app.whenReady()
    .then(installExtensions)
    .then(setCertificateVerifyProc)
    .then(async () => {
      // Проверяем и устанавливаем PulseAudio на UNIX системах
      if (!IS_WINDOWS) {
        try {
          await PulseAudioInstaller.checkAndInstallPulseAudio();
        } catch (error) {
          logger.warn('PulseAudio installation failed, continuing without system audio support', error);
        }
      }
    })
    .catch(console.log);
  return app.whenReady();
}
