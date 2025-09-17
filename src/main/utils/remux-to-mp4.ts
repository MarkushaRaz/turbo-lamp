import ffmpeg from 'fluent-ffmpeg';
import { unlink } from 'fs';
import log from 'electron-log';
import path, { join } from 'path';
import { asError } from '_shared/utils';
import { getSettings } from '../providers';
import { MP4_EXT } from '../constants';

const logger = log.scope('RemuxToMp4');

export const remuxToMp4 = (filePath: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    logger.debug('Trying to convert to mp4');
    const ext = path.extname(filePath);
    if (ext === MP4_EXT) {
      logger.debug(`File already convert from webm to mp4: ${filePath}`);
      resolve(filePath);
      return;
    }

    const filename = path.basename(filePath, ext);
    if (!filename) {
      reject(new Error(`FixVideoContainer: Unable to extract the filename from the given path: ${filePath}`));
      return;
    }

    const { recordingPath } = getSettings();
    const newPath = join(recordingPath, `${filename}${MP4_EXT}`);

    try {
      ffmpeg(filePath)
        .addOptions(['-y', '-codec copy'])
        .saveToFile(newPath)
        .on('error', (err) => {
          reject(new Error(`FixVideoContainer: Cannot process video: ${asError(err)}`));
        })
        .on('end', () => {
          unlink(filePath, (err) => {
            if (err) {
              logger.info(`FixVideoContainer: failed to delete the original file at ${filePath}: ${asError(err)}`, err);
            }
            logger.debug(`File successfully converted to mp4: ${newPath}`);
            resolve(newPath);
          });
        });
    } catch (e) {
      reject(new Error(`FixVideoContainer: Cannot process video: ${asError(e)}`));
    }
  });
};
