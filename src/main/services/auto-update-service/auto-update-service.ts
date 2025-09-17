import fs from 'fs';
import { powerMonitor } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { AUTO_UPDATE_DELAY, UPDATED_FILE_PATH } from '_main/constants';
import { windowManager } from '_main/window-manager';
import { EntryWindow, RecordingWindow, SplashWindow } from '_main/windows';
import { ScheduledRecordingService } from '_main/services/scheduled-recording-service/ScheduledRecordingService';
import { IS_DEV } from '_shared/constants';
import { asError } from '_shared/utils';

const logger = log.scope('AutoUpdateService');

let isUpdating = false;

autoUpdater.logger = logger;

function canUpdate() {
  const currentWindowName = windowManager.getCurrentWindow()?.className ?? '';
  if (currentWindowName === SplashWindow.name) return true;

  const isIdle = powerMonitor.getSystemIdleState(60) === 'idle';
  const hasNoPendingRecording = !ScheduledRecordingService.isRecordingPending();
  const ignoredWindows = [EntryWindow.name, RecordingWindow.name];
  const isAllowedWindow = !ignoredWindows.includes(currentWindowName);

  return isIdle && hasNoPendingRecording && isAllowedWindow;
}

function updateSilent() {
  isUpdating = true;
  try {
    if (!fs.existsSync(UPDATED_FILE_PATH)) fs.closeSync(fs.openSync(UPDATED_FILE_PATH, 'w'));
  } catch (e) {
    logger.error('Failed to create the ".updated" file.', asError(e));
  }

  autoUpdater.quitAndInstall(true, true);
}

autoUpdater.on('update-downloaded', () => {
  if (!canUpdate()) return;
  updateSilent();
});

function runCheckForUpdates() {
  logger.info('Сheck for updates');
  if (canUpdate()) {
    // noinspection JSIgnoredPromiseFromCall
    autoUpdater.checkForUpdates();
  }
  return runCheckForUpdates;
}

export function isAutoUpdating() {
  return isUpdating;
}

export function appHasUpdated() {
  try {
    logger.info('Check app has been updated...');
    if (fs.existsSync(UPDATED_FILE_PATH)) {
      fs.unlink(UPDATED_FILE_PATH, (err) => {
        if (err) logger.error('Failed to remove the ".updated" file.', asError(err));
      });
      logger.info('Application updated');
      return true;
    }
  } catch (e) {
    logger.error('Failed to check if the app has updated.', asError(e));
  }
  logger.info('Application NOT updated');

  return false;
}

export function startAutoUpdateService() {
  logger.info('Starting auto update service');
  if (IS_DEV) return Promise.resolve();

  setInterval(runCheckForUpdates(), AUTO_UPDATE_DELAY);

  return new Promise<void>((resolve) => {
    if (autoUpdater.isUpdaterActive()) {
      autoUpdater.once('error', () => resolve());
      autoUpdater.once('update-not-available', () => resolve());
      autoUpdater.once('update-cancelled', () => resolve());
    } else {
      resolve();
    }
  });
}
