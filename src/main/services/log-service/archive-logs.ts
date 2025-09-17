import { DEFAULT_LOG_PATH, ARCHIVE_EXT } from '_main/constants';
import { rm, readdir } from 'fs/promises';
import { zipDirectory } from '_main/utils';
import moment from 'moment';
import path from 'path';
import log from 'electron-log';
import { asError } from '_shared/utils';

const logger = log.scope('ArchiveLogs');

const deleteFolderRecurcise = (folderPath: string, recursive = true): Promise<void> => rm(folderPath, { recursive });

const getPath = (name: string) => path.join(DEFAULT_LOG_PATH, name);

const archiveOldLogFolders = async (): Promise<void> => {
  try {
    const dirs = await readdir(DEFAULT_LOG_PATH, { withFileTypes: true });
    const today = moment().format('DD-MM-YYYY');
    const logFolderNames = dirs.filter((dir) => dir.isDirectory() && !dir.name.includes(today)).map(({ name }) => name);
    for (const name of logFolderNames) {
      const folder = getPath(name);
      const file = getPath(`${name}.logs${ARCHIVE_EXT}`);
      await zipDirectory(folder, file);
      await deleteFolderRecurcise(folder);
    }
  } catch (e) {
    const error = asError(e);
    logger.error(error.message, error);
  } finally {
    setTimeout(archiveOldLogFolders, 86_400_000);
  }
};

export const startArchiveOldLogsService = archiveOldLogFolders;
