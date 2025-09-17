import log from 'electron-log';
import archiver from 'archiver';
import fs from 'fs';

const logger = log.scope('ZipDirectory');

export const zipDirectory = (sourceDir: string, outPath: string): Promise<string> => {
  logger.debug(`Trying to zip ${sourceDir} directory`);
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', (err) => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve(sourceDir));
    archive.finalize();
  });
};
