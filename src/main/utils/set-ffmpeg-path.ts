import log from 'electron-log';
import pathToFfmpeg from 'ffmpeg-static';
import Ffmpeg from 'fluent-ffmpeg';
import i18n from 'i18next';

const logger = log.scope('Ffmpeg');

const ffmpegPath = pathToFfmpeg?.replace('app.asar', 'app.asar.unpacked') || '';

export const setFfmpegPath = () => {
  logger.info(`Set ffmpeg path to "${ffmpegPath}"`);
  if (!ffmpegPath) {
    throw new Error(i18n.t<string>('app.error.ffmpegNotFound'));
  }
  return Ffmpeg.setFfmpegPath(ffmpegPath);
};
