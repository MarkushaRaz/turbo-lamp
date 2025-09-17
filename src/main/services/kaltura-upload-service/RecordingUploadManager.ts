import log, { LogFunctions } from 'electron-log';
import { Stats, existsSync, statSync } from 'fs';
import path from 'path';
import { MP4_EXT, WEBM_EXT } from '_main/constants';
import { Entry, Recording } from '_main/database/entities';
import { recordingRepository } from '_main/database/repositories';
import { remuxToMp4 } from '_main/utils';
import { EMPTY_STRING } from '_shared/constants';
import { UploadStatus } from '_shared/enums';
import { asError } from '_shared/utils';
import { MediaEntryManager } from './MediaEntryManager';

export class RecordingUploadManager {
  private readonly entry: Entry;

  private readonly recording: Recording;

  private readonly logger: LogFunctions;

  private filePath: string = EMPTY_STRING;

  constructor(recording: Recording, entry: Entry) {
    this.entry = entry;
    this.recording = recording;
    this.filePath = recording.filePath;
    this.logger = log.scope(`RecordingUploadManager/${this.recording.id}`);
    this.logger.info('Start to process recording:', recording.id);
  }

  private getErrorMessage = (message: string, error: Error) => {
    let reason = '';

    try {
      reason = JSON.stringify(error.message);
    } catch (e) {
      reason = error.message.toString();
    }

    return `${message} Reason: ${reason}`;
  };

  private saveRecording = (): Promise<Recording> => recordingRepository.save(this.recording);

  private getFileStats = (): Stats => statSync(this.filePath);

  private findFileByExtension(extension: string) {
    const currentExtension = path.extname(this.filePath);
    const file = this.filePath.replace(currentExtension, extension);
    return existsSync(file) ? file : undefined;
  }

  private determineFilePath(): string {
    const mp4 = this.findFileByExtension(MP4_EXT);
    const webm = this.findFileByExtension(WEBM_EXT);
    return mp4 || webm || EMPTY_STRING;
  }

  private async ensureFileExistsAndIsNotEmpty(): Promise<void> {
    try {
      this.filePath = this.determineFilePath();
      this.recording.filePath = this.filePath;

      if (this.filePath && this.getFileStats().size) return;

      this.recording.uploadStatus = UploadStatus.FileMissing;
      throw new Error(`File does not exist or is empty: ${this.filePath}`);
    } finally {
      await this.saveRecording();
    }
  }

  /**
   * First step of uploading recording
   */
  public async fixVideoContainer(): Promise<void> {
    try {
      this.logger.debug('Trying to fix recording header.');
      await this.ensureFileExistsAndIsNotEmpty();

      if (!this.filePath.includes(MP4_EXT)) {
        this.filePath = await remuxToMp4(this.filePath);
        this.logger.info('Recording header fixed successfully.');
      }

      this.recording.filePath = this.filePath;
      this.recording.size = this.getFileStats().size;
      this.logger.debug('Update recording path and size.');
      await this.saveRecording();
    } catch (error) {
      throw new Error(this.getErrorMessage('Failed to fix recording header.', asError(error)));
    }
  }

  private async checkUploadTokenValidity(): Promise<boolean> {
    const { isValid, token } = await MediaEntryManager.isUploadTokenValid(this.recording.tokenId);
    if (!token) return false;
    if (Number(token.uploadedFileSize) === this.recording.size) return true;
    return isValid;
  }

  /**
   * Second step of uploading record
   */
  public async createMediaEntryUploadToken(): Promise<void> {
    try {
      this.logger.debug('Trying to create an upload token.');

      const isTokenValid = await this.checkUploadTokenValidity();
      if (isTokenValid) return;

      this.logger.debug('Previous token:', this.recording.tokenId);

      const token = await MediaEntryManager.createAndActivateUploadToken(this.entry.name);
      this.recording.tokenId = token.id;

      this.logger.debug('New token:', this.recording.tokenId);
      this.logger.info('Upload token created successfully');
      await this.saveRecording();
    } catch (error) {
      throw new Error(this.getErrorMessage('Failed to create or validate upload token.', asError(error)));
    }
  }

  /**
   * Third step of uploading record
   */
  public async uploadRecording(): Promise<void> {
    try {
      this.logger.debug('Trying to upload recording.');
      await this.ensureFileExistsAndIsNotEmpty();

      if (!this.filePath.includes(MP4_EXT))
        throw new Error('The recording does not have an mp4 extension before upload');

      if (this.recording.bytesUploaded === this.recording.size) {
        this.logger.warn('Recording already uploaded.');
        return;
      }

      const uploadManager = new MediaEntryManager(this.recording);
      await uploadManager.startFileUploading(this.entry);

      this.logger.info('Recording uploaded successfully.');
    } catch (error) {
      throw new Error(this.getErrorMessage('Recording upload failed.', asError(error)));
    }
  }

  /**
   * Fourth step of uploading record
   */
  public async createMediaEntry(child: boolean): Promise<void> {
    try {
      this.logger.debug('Trying to create media entry.');

      if (this.recording.kalturaEntryId) {
        const mediaEntryExists = await MediaEntryManager.checkMediaEntryExists(this.recording.kalturaEntryId);
        if (mediaEntryExists) {
          this.logger.debug('Media entry is already created.');
          return;
        }
      }

      const mediaEntry = await MediaEntryManager.createMediaEntry(this.entry, child);

      this.recording.kalturaEntryId = mediaEntry.id;
      await this.saveRecording();

      this.logger.info('Media entry created successfully.');
    } catch (error) {
      throw new Error(this.getErrorMessage('Failed to create a new entry.', asError(error)));
    }
  }

  /**
   * Fifth step of uploading record
   */
  public async addContentToMediaEntry(): Promise<void> {
    try {
      this.logger.debug('Trying to add content to media entry.');
      if (!this.recording.kalturaEntryId || !this.recording.tokenId) {
        this.logger.warn('Media entry or upload token is not set.');
        return;
      }
      await MediaEntryManager.addContentToMediaEntry(this.recording.kalturaEntryId, this.recording.tokenId);
      this.logger.info('Content added to media entry successfully.');

      this.recording.uploadStatus = UploadStatus.FileUploaded;
    } catch (error) {
      if ((error as { code?: string }).code === 'ENTRY_ALREADY_WITH_CONTENT') {
        this.logger.debug('Content is already added.');
        this.recording.uploadStatus = UploadStatus.FileUploaded;
        return;
      }
      throw new Error(this.getErrorMessage('Failed to add content to the entry:', asError(error)));
    } finally {
      await this.saveRecording();
    }
  }
}
