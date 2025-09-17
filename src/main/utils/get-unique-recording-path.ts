import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { DEFAULT_RECORDING_PATH } from '_main/constants';
import { getSettings } from '_main/providers';
import log from 'electron-log';

const logger = log.scope('RecordingPath');

export function getUniqueRecordingPath(ext = 'webm') {
  logger.debug('Trying to get unique recording path');
  let recordingDirectoryPath: string;

  if (getSettings().recordingPath) {
    try {
      path.parse(getSettings().recordingPath);
      recordingDirectoryPath = getSettings().recordingPath;
    } catch (e) {
      recordingDirectoryPath = DEFAULT_RECORDING_PATH;
    }
  } else {
    recordingDirectoryPath = DEFAULT_RECORDING_PATH;
  }

  let uniqueFilePath;

  do {
    uniqueFilePath = path.join(recordingDirectoryPath, `${uuid()}.${ext}`);
  } while (fs.existsSync(uniqueFilePath));

  logger.debug(`Recording path is ${uniqueFilePath}`);
  return uniqueFilePath;
}
