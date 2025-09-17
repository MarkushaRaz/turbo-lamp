import log, { LogFunctions } from 'electron-log';
import { Entry, Recording } from '_main/database/entities';
import { entryRepository, recordingRepository } from '_main/database/repositories';
import { getSettings } from '_main/providers';
import { EntryStatus, UploadStatus } from '_shared/enums';
import { asError } from '_shared/utils';
import { MoodleService } from '../moodle-service';
import { SakaiService } from '../sakai-service';
import { MediaEntryManager } from './MediaEntryManager';
import { RecordingUploadManager } from './RecordingUploadManager';
import { EntryUploadQueue } from './EntryUploadQueue';

export class EntryUploadManager {
  private readonly entry: Entry;

  private readonly mainRecording: Recording;

  private readonly childRecording: Recording | undefined;

  private readonly logger: LogFunctions;

  public static add(entry: Entry): void {
    if (EntryUploadQueue.has(entry.id)) return;
    EntryUploadQueue.add(entry.id);
    const service = new EntryUploadManager(entry);
    setImmediate(() => service.processEntry());
  }

  private constructor(entry: Entry) {
    this.logger = log.scope(`EntryUploadManager/${entry.id}`);
    this.entry = entry;

    const { recordings, primaryChannel } = entry;
    [this.mainRecording, this.childRecording] = recordings;

    if (this.childRecording?.source.includes(primaryChannel))
      [this.mainRecording, this.childRecording] = [this.childRecording, this.mainRecording];

    this.logger.debug('Entry id:', this.entry.id);
    this.logger.debug(`Main recording: id: ${this.mainRecording.id}, source: ${this.mainRecording.source}`);
    this.logger.debug(`Child recording: id: ${this.childRecording?.id}, source: ${this.childRecording?.source}`);
  }

  private saveEntry(): Promise<Entry> {
    return entryRepository.save(this.entry);
  }

  private async processEntry(): Promise<void> {
    try {
      this.logger.debug('Trying to process entry with id:', this.entry.id, 'Status:', this.entry.status);
      this.entry.status = EntryStatus.Uploading;
      await this.saveEntry();
      await this.processRecording(this.mainRecording);
      await this.processRecording(this.childRecording, true);
      await this.setPrimaryMediaEntry();
      await this.embedIntoMoodle();
      await this.embedIntoSakai();
    } catch (error) {
      this.logger.error('Entry processing failed.', asError(error).message);
      await this.saveEntry();
    } finally {
      EntryUploadQueue.remove(this.entry.id);
      await this.checkMissingRecordings();
    }
  }

  private async updateEntrySize() {
    this.entry.size = this.mainRecording.size + (this.childRecording?.size || 0);
    await this.saveEntry();
  }

  private async processRecording(recording: Recording | undefined, child = false): Promise<void> {
    if (!recording) return;

    const unavailableForUpload = [
      UploadStatus.UnavailableForUpload,
      UploadStatus.FileUploaded,
      UploadStatus.FileMissing,
    ];

    if (unavailableForUpload.includes(recording.uploadStatus)) return;

    const uploadService = new RecordingUploadManager(recording, this.entry);
    await uploadService.fixVideoContainer();
    await this.updateEntrySize();
    await uploadService.createMediaEntryUploadToken();
    await uploadService.uploadRecording();
    await uploadService.createMediaEntry(child);
    await uploadService.addContentToMediaEntry();
  }

  private async setPrimaryMediaEntry(): Promise<void> {
    if (!this.childRecording) {
      this.entry.primaryKalturaEntryId = this.mainRecording.kalturaEntryId;
      this.logger.debug('No child recording. Setting the main recording as primary.');
      await this.saveEntry();
      return;
    }

    if (!this.mainRecording.kalturaEntryId || !this.childRecording.kalturaEntryId) return;

    this.logger.debug('Trying to set parent id for entries:', this.mainRecording.id, '/', this.childRecording.id);

    const bothEntriesExist =
      (await this.checkMediaEntryExists(this.mainRecording)) && (await this.checkMediaEntryExists(this.childRecording));
    if (!bothEntriesExist) throw new Error(`One of the entries doesn't exist. Failed to set the parent entry.`);

    await MediaEntryManager.setParentId(this.childRecording.kalturaEntryId, this.mainRecording.kalturaEntryId);
    this.entry.primaryKalturaEntryId = this.mainRecording.kalturaEntryId;

    await this.saveEntry();

    this.logger.debug('Parent entry was set successfully.');
  }

  private async checkMediaEntryExists(recording: Recording): Promise<boolean> {
    if (!recording.kalturaEntryId) return false;
    this.logger.debug('Checking if media entry exists:', recording.kalturaEntryId);
    const mediaEntryExists = await MediaEntryManager.checkMediaEntryExists(recording.kalturaEntryId);
    if (mediaEntryExists) return mediaEntryExists;
    recording.tokenId = null;
    recording.bytesUploaded = 0;
    recording.kalturaEntryId = null;
    recording.uploadStatus = UploadStatus.UploadingFailed;
    await recordingRepository.save(recording);
    this.logger.debug('Media entry do not exist, rollback the upload.');
    return mediaEntryExists;
  }

  private countRecordingsByStatus = (...statuses: UploadStatus[]) =>
    this.entry.recordings.filter((value) => statuses.includes(value.uploadStatus)).length;

  private async checkMissingRecordings(): Promise<void> {
    if (!this.entry.primaryKalturaEntryId) return;

    this.logger.debug('Checking entry for missing recordings');

    const uploading = this.countRecordingsByStatus(UploadStatus.UploadingFile, UploadStatus.ReadyToUpload);
    if (uploading) {
      this.logger.debug('Not all recordings have been uploaded.');
      return;
    }

    const missingFileCount = this.countRecordingsByStatus(UploadStatus.FileMissing);

    if (missingFileCount === 0) {
      this.entry.status = EntryStatus.Uploaded;
    } else if (missingFileCount === this.entry.recordings.length) {
      this.entry.status = EntryStatus.Failed;
    } else {
      this.entry.status = EntryStatus.PartiallyUploaded;
    }

    this.logger.debug(`${missingFileCount} files are missing.`);

    await this.saveEntry();
  }

  private embedIntoMoodle() {
    const { moodleEnabled } = getSettings();
    if (!moodleEnabled) return Promise.resolve();

    const { moodleCmid, primaryKalturaEntryId, scheduleId } = this.entry;
    if (!moodleCmid || !primaryKalturaEntryId) return Promise.resolve();

    return MoodleService.embedEntryPlayerIntoLesson(primaryKalturaEntryId, moodleCmid).catch((e) => {
      const error = asError(e);
      this.logger.error(
        `Failed to embed player for lecture ${scheduleId} into Moodle resource ${moodleCmid}: ${error.message}`,
        error,
      );
    });
  }

  private embedIntoSakai() {
    const { sakaiEnabled } = getSettings();
    if (!sakaiEnabled) return Promise.resolve();

    const { sakaiIdcs, primaryKalturaEntryId, scheduleId } = this.entry;
    if (!sakaiIdcs || !primaryKalturaEntryId) return Promise.resolve();

    return SakaiService.addEntryPlayerIntoSakaiModule(this.entry).catch((e) => {
      const error = asError(e);
      this.logger.error(
        `Failed to embed player for lecture ${scheduleId} into Sakai module ${sakaiIdcs}: ${error.message}`,
        error,
      );
    });
  }
}
