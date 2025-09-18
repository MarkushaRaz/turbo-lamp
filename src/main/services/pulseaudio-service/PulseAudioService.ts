import log from 'electron-log';
import { spawn, ChildProcess } from 'child_process';
import { createWriteStream, WriteStream } from 'fs';
import { asError } from '_shared/utils';
import { IS_WINDOWS } from '_shared/constants';
import { PulseAudioConfig, PulseAudioSource } from './types';

const logger = log.scope('PulseAudioService');

export class PulseAudioService {
  private static instance: PulseAudioService | null = null;
  
  private parecordProcess: ChildProcess | null = null;
  private outputStream: WriteStream | null = null;
  private isRecording = false;
  private config: PulseAudioConfig;

  private constructor() {
    this.config = {
      sampleRate: 44100,
      channels: 2,
      format: 'S16LE',
      bufferSize: 4096,
    };
  }

  public static getInstance(): PulseAudioService {
    if (!PulseAudioService.instance) {
      PulseAudioService.instance = new PulseAudioService();
    }
    return PulseAudioService.instance;
  }

  public static isSupported(): boolean {
    // PulseAudio поддерживается только на UNIX системах (Linux, macOS)
    return !IS_WINDOWS;
  }

  public async getAvailableSources(): Promise<PulseAudioSource[]> {
    if (!PulseAudioService.isSupported()) {
      logger.warn('PulseAudio is not supported on this platform');
      return [];
    }

    return new Promise((resolve, reject) => {
      logger.debug('Getting available PulseAudio sources');
      
      const pactl = spawn('pactl', ['list', 'sources', 'short']);
      let output = '';

      pactl.stdout.on('data', (data) => {
        output += data.toString();
      });

      pactl.on('close', (code) => {
        if (code !== 0) {
          logger.error(`pactl exited with code ${code}`);
          reject(new Error(`Failed to get PulseAudio sources: pactl exited with code ${code}`));
          return;
        }

        try {
          const sources = this.parsePactlOutput(output);
          logger.debug(`Found ${sources.length} PulseAudio sources`);
          resolve(sources);
        } catch (error) {
          logger.error('Failed to parse pactl output', asError(error));
          reject(error);
        }
      });

      pactl.on('error', (error) => {
        logger.error('Failed to execute pactl', asError(error));
        reject(error);
      });
    });
  }

  private parsePactlOutput(output: string): PulseAudioSource[] {
    const lines = output.trim().split('\n');
    const sources: PulseAudioSource[] = [];

    for (const line of lines) {
      if (!line.trim()) continue;
      
      const parts = line.split('\t');
      if (parts.length >= 4) {
        const [indexStr, name, , description] = parts;
        
        // Фильтруем только мониторы (системные звуки)
        if (name.includes('.monitor')) {
          sources.push({
            name,
            description: description || name,
            index: parseInt(indexStr, 10),
            sampleSpec: {
              format: this.config.format,
              rate: this.config.sampleRate,
              channels: this.config.channels,
            },
          });
        }
      }
    }

    return sources;
  }

  public async startRecording(sourceName: string, outputPath: string): Promise<void> {
    if (!PulseAudioService.isSupported()) {
      throw new Error('PulseAudio is not supported on this platform');
    }

    if (this.isRecording) {
      logger.warn('PulseAudio recording is already in progress');
      return;
    }

    logger.info(`Starting PulseAudio recording from source: ${sourceName}`);

    try {
      this.outputStream = createWriteStream(outputPath);
      
      const args = [
        '--device', sourceName,
        '--format', this.config.format,
        '--rate', this.config.sampleRate.toString(),
        '--channels', this.config.channels.toString(),
        '--raw'
      ];

      this.parecordProcess = spawn('parecord', args);

      this.parecordProcess.stdout.pipe(this.outputStream);

      this.parecordProcess.on('error', (error) => {
        logger.error('PulseAudio recording process error', asError(error));
        this.stopRecording();
        throw error;
      });

      this.parecordProcess.on('close', (code) => {
        logger.debug(`PulseAudio recording process closed with code: ${code}`);
        this.isRecording = false;
      });

      this.isRecording = true;
      logger.info('PulseAudio recording started successfully');
    } catch (error) {
      logger.error('Failed to start PulseAudio recording', asError(error));
      this.cleanup();
      throw error;
    }
  }

  public stopRecording(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isRecording || !this.parecordProcess) {
        resolve();
        return;
      }

      logger.info('Stopping PulseAudio recording');

      this.parecordProcess.once('close', () => {
        this.cleanup();
        logger.info('PulseAudio recording stopped');
        resolve();
      });

      // Отправляем SIGTERM для корректного завершения
      this.parecordProcess.kill('SIGTERM');
      
      // Если процесс не завершился через 5 секунд, принудительно убиваем
      setTimeout(() => {
        if (this.parecordProcess && !this.parecordProcess.killed) {
          logger.warn('Force killing PulseAudio process');
          this.parecordProcess.kill('SIGKILL');
        }
      }, 5000);
    });
  }

  public pauseRecording(): void {
    if (this.parecordProcess && this.isRecording) {
      logger.debug('Pausing PulseAudio recording');
      this.parecordProcess.kill('SIGSTOP');
    }
  }

  public resumeRecording(): void {
    if (this.parecordProcess && this.isRecording) {
      logger.debug('Resuming PulseAudio recording');
      this.parecordProcess.kill('SIGCONT');
    }
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }

  public setConfig(config: Partial<PulseAudioConfig>): void {
    this.config = { ...this.config, ...config };
    logger.debug('PulseAudio config updated', this.config);
  }

  private cleanup(): void {
    if (this.outputStream) {
      this.outputStream.end();
      this.outputStream = null;
    }
    
    this.parecordProcess = null;
    this.isRecording = false;
  }
}