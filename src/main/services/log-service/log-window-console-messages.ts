import { BrowserWindow } from 'electron';
import log from 'electron-log';

export function logWindowConsoleMessages(window: BrowserWindow, logScope: string) {
  const logger = log.scope(logScope);

  const getLogFunctionForLevel = (level: number) => {
    switch (level) {
      case 0:
        return logger.verbose;
      case 1:
        return logger.info;
      case 2:
        return logger.warn;
      case 3:
        return logger.error;
      default:
        return logger.log;
    }
  };

  window.webContents.on('console-message', (_, level, message, line, sourceId) => {
    const logFunction = getLogFunctionForLevel(level);
    logFunction(`(${sourceId}:${line}): ${message}`);
  });
}
