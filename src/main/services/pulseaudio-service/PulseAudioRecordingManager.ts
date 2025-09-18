import log from 'electron-log';
import path from 'path';
import { existsSync, unlinkSync } from 'fs';
import { convertRawAudioToWav } from '_main/utils';
import { PulseAudioService } from './PulseAudioService';
import { asError } from '_shared/utils';

const logger = log.scope('PulseAudioRecordingManager');

export class PulseAudioRecordingManager {
  private static instance: PulseAudioRecordingManager | null = null;
  private pulseAudioService: PulseAudioService;
  private currentRecordingPath: string | null = null;
  private isActive = false;

  private constructor() {
    this.pulseAudioService = PulseAudioService.getInstance();
  }

  public static getInstance(): PulseAudioRecordingManager {
    if (!PulseAudioRecordingManager.instance) {
      PulseAudioRecordingManager.instance = new PulseAudioRecordingManager();
    }
    return PulseAudioRecordingManager.instance;
  }

  public async startSystemAudioRecording(baseRecordingPath: string): Promise<string | null> {
    if (!PulseAudioService.isSupported() || this.isActive) {
      return null;
    }

    try {
      logger.info('Starting system audio recording with PulseAudio');
      
      const sources = await this.pulseAudioService.getAvailableSources();
      if (!sources.length) {
        logger.warn('No PulseAudio monitor sources available');
        return null;
      }

      // Выбираем лучший доступный монитор для записи системного звука
      const systemAudioSource = sources.find(source => 
        source.name.includes('alsa_output') && source.name.includes('.monitor')
      ) || sources.find(source => 
        source.name.includes('.monitor')
      ) || sources[0];

      // Создаем уникальный путь для файла системного звука
      const directory = path.dirname(baseRecordingPath);
      const timestamp = Date.now();
      this.currentRecordingPath = path.join(directory, `system-audio-${timestamp}.raw`);

      await this.pulseAudioService.startRecording(systemAudioSource.name, this.currentRecordingPath);
      this.isActive = true;

      logger.info(`System audio recording started: ${systemAudioSource.description}`);
      return this.currentRecordingPath;
    } catch (error) {
      logger.error('Failed to start system audio recording', asError(error));
      this.currentRecordingPath = null;
      return null;
    }
  }

  public async stopSystemAudioRecording(): Promise<void> {
    if (!this.isActive || !this.pulseAudioService.getIsRecording()) {
      return;
    }

    try {
      logger.info('Stopping system audio recording');
      await this.pulseAudioService.stopRecording();
      this.isActive = false;
      
      if (this.currentRecordingPath && fs.existsSync(this.currentRecordingPath)) {
        logger.info(`System audio recording saved to: ${this.currentRecordingPath}`);
        
        // Конвертируем RAW аудио в WAV формат
        try {
          const wavPath = this.currentRecordingPath.replace('.raw', '.wav');
          await convertRawAudioToWav({
            inputPath: this.currentRecordingPath,
            outputPath: wavPath,
            sampleRate: 44100,
            channels: 2,
            format: 'S16LE',
          });
          
          // Удаляем исходный RAW файл после успешной конвертации
          unlinkSync(this.currentRecordingPath);
          this.currentRecordingPath = wavPath;
          
          logger.info(`System audio converted to WAV: ${wavPath}`);
        } catch (conversionError) {
          logger.error('Failed to convert RAW audio to WAV', asError(conversionError));
        }
      }
    } catch (error) {
      logger.error('Failed to stop system audio recording', asError(error));
    } finally {
      this.currentRecordingPath = null;
      this.isActive = false;
    }
  }

  public pauseSystemAudioRecording(): void {
    if (this.isActive && this.pulseAudioService.getIsRecording()) {
      this.pulseAudioService.pauseRecording();
    }
  }

  public resumeSystemAudioRecording(): void {
    if (this.isActive && this.pulseAudioService.getIsRecording()) {
      this.pulseAudioService.resumeRecording();
    }
  }

  public getCurrentRecordingPath(): string | null {
    return this.currentRecordingPath;
  }

  public isRecording(): boolean {
    return this.isActive;
  }

  public getOutputPath(): string | null {
    return this.currentRecordingPath;
  }
}