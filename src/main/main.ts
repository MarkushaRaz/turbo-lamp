import 'reflect-metadata';
import '_main/services/log-service/log-extentions';
import { bootstrap, initializeStore, produceSystemFingerprintOrThrow } from '_main/bootstrap';
import { initializeDataSource, initializeLogDataSource } from '_main/database';
import { windowManager } from '_main/window-manager';
import { initTray } from '_main/tray';
import { cleanupPreviousSession, ensureSingleInstance, logAndQuitWithErrorBox, setFfmpegPath } from '_main/utils';
import { WindowRoute } from '_shared/enums';
import { START_MINIMIZED } from '_shared/constants';
import {
  appHasUpdated,
  checkLicense,
  startAutoUpdateService,
  startCleanupService,
  startUploadService,
  startRecordingSchedulerService,
  startScheduleBeaconService,
  startScheduledRecordingService,
  startScheduleSyncService,
  startStreamdeckService,
  startScheduledCommunicationService,
  startDbLogQueueService,
  startArchiveOldLogsService,
} from './services';

ensureSingleInstance();

const hidden = START_MINIMIZED || appHasUpdated();

produceSystemFingerprintOrThrow()
  .then(initializeStore)
  .then(bootstrap)
  .then(initializeLogDataSource)
  .then(startDbLogQueueService)
  .then(() => windowManager.load(WindowRoute.SplashWindow, hidden))
  .then(startAutoUpdateService)
  .then(checkLicense)
  .then(initializeDataSource)
  .then(cleanupPreviousSession)
  .then(() => windowManager.load(WindowRoute.MainWindow, hidden))
  .then(() => initTray())
  .then(setFfmpegPath)
  .then(startUploadService)
  .then(startCleanupService)
  .then(startScheduleBeaconService)
  .then(startRecordingSchedulerService)
  .then(startScheduledRecordingService)
  .then(startScheduleSyncService)
  .then(startStreamdeckService)
  .then(startScheduledCommunicationService)
  .then(startArchiveOldLogsService)
  .catch((e) => logAndQuitWithErrorBox(e, windowManager.getCurrentWindow()?.getBrowserWindow()));
