import log from 'electron-log';
import { setAktruMeetBroadcastingAction } from '_shared/actions';
import { getDataSource } from '_main/database';
import { Entry, Recording } from '_main/database/entities';
import { EntryStatus, RecordingStatus, UploadStatus } from '_shared/enums';
import { getStore } from '../providers';

const logger = log.scope('CleanUpSession');

function failRecordingEntries() {
  return getDataSource()
    .createQueryBuilder()
    .update(Entry)
    .set({ status: EntryStatus.Failed })
    .where({ status: EntryStatus.Recording })
    .execute();
}

function failStartedRecordings() {
  return getDataSource()
    .createQueryBuilder()
    .update(Recording)
    .set({ recordingStatus: RecordingStatus.Failed })
    .where({ recordingStatus: RecordingStatus.Started })
    .execute();
}

function failPausedRecordings() {
  return getDataSource()
    .createQueryBuilder()
    .update(Recording)
    .set({ recordingStatus: RecordingStatus.Failed })
    .where({ recordingStatus: RecordingStatus.Paused })
    .execute();
}

function setEntriesReadyToUpload() {
  return getDataSource()
    .createQueryBuilder()
    .update(Entry)
    .set({ status: EntryStatus.ReadyToUpload })
    .where({ status: EntryStatus.Recorded })
    .execute();
}

function setRecordingsReadyToUpload() {
  return getDataSource()
    .createQueryBuilder()
    .update(Recording)
    .set({ uploadStatus: UploadStatus.ReadyToUpload })
    .where({ recordingStatus: RecordingStatus.Finished, uploadStatus: UploadStatus.UnavailableForUpload })
    .execute();
}

function resetPendingEntries() {
  return getDataSource()
    .createQueryBuilder()
    .update(Entry)
    .set({ status: EntryStatus.New })
    .where({ status: EntryStatus.Pending })
    .execute();
}

function resetUploadingEntries() {
  return getDataSource()
    .createQueryBuilder()
    .update(Entry)
    .set({ status: EntryStatus.ReadyToUpload })
    .where({ status: EntryStatus.Uploading })
    .execute();
}

function resetAktruMeetBroadcastingState() {
  const store = getStore();
  store.dispatch(setAktruMeetBroadcastingAction(false));
}

export async function cleanupPreviousSession() {
  logger.info('Cleanup previous session');
  logger.info('Set recording entries "failed" status');
  await failRecordingEntries();
  logger.info('Set started recordings "failed" status');
  await failStartedRecordings();
  logger.info('Set paused recordings "failed" status');
  await failPausedRecordings();
  logger.info('Set recorded entries "ready to upload" status');
  await setEntriesReadyToUpload();
  logger.info('Set recorded recordings "ready to upload" status');
  await setRecordingsReadyToUpload();
  logger.info('Set pending entries "new" status');
  await resetPendingEntries();
  await resetUploadingEntries();
  resetAktruMeetBroadcastingState();
}
