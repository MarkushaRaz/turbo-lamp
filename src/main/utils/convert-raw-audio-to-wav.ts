import log from 'electron-log';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { asError } from '_shared/utils';

const logger = log.scope('ConvertRawAudioToWav');

export interface AudioConversionOptions {
  inputPath: string;
  outputPath: string;
  sampleRate: number;
  channels: number;
  format: 'S16LE' | 'S24LE' | 'S32LE' | 'F32LE';
}

export const convertRawAudioToWav = (options: AudioConversionOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { inputPath, outputPath, sampleRate, channels, format } = options;

    if (!existsSync(inputPath)) {
      reject(new Error(`Input file does not exist: ${inputPath}`));
      return;
    }

    logger.debug(`Converting RAW audio to WAV: ${inputPath} -> ${outputPath}`);

    // Используем ffmpeg для конвертации RAW аудио в WAV
    const ffmpegArgs = [
      '-f', format.toLowerCase(),
      '-ar', sampleRate.toString(),
      '-ac', channels.toString(),
      '-i', inputPath,
      '-y', // Перезаписать выходной файл если существует
      outputPath
    ];

    const ffmpeg = spawn('ffmpeg', ffmpegArgs);

    ffmpeg.on('error', (error) => {
      logger.error('FFmpeg process error', asError(error));
      reject(new Error(`FFmpeg conversion failed: ${asError(error).message}`));
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        logger.info(`Audio conversion completed successfully: ${outputPath}`);
        resolve(outputPath);
      } else {
        logger.error(`FFmpeg exited with code ${code}`);
        reject(new Error(`FFmpeg conversion failed with exit code: ${code}`));
      }
    });

    ffmpeg.stderr.on('data', (data) => {
      logger.debug(`FFmpeg stderr: ${data}`);
    });
  });
};