import log from 'electron-log';
import { app } from 'electron';

const logger = log.scope('SingleInstance');

export function ensureSingleInstance() {
  if (!app.requestSingleInstanceLock()) {
    logger.warn('Application instance found. Close.');
    app.exit(0);
  }
}
