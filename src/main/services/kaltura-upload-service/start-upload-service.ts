import log from 'electron-log';
import { FindManyOptions, In } from 'typeorm';
import { UPLOAD_SERVICE_DELAY } from '_main/constants';
import { Entry } from '_main/database/entities';
import { entryRepository } from '_main/database/repositories';
import { getSettings } from '_main/providers';
import { deleteEntriesAfterUpload } from '_main/services/cleanup-service';
import { EntryStatus } from '_shared/enums';
import { asError } from '_shared/utils';
import { EntryUploadManager } from './EntryUploadManager';
import { KalturaClientManager } from './KalturaClientManager';

const logger = log.scope('StartUploadService');

const MAX_CONCURRENT_UPLOADS = 2;

const findOptions: FindManyOptions<Entry> = {
  relations: ['recordings'],
  where: { status: In([EntryStatus.ReadyToUpload, EntryStatus.Uploading]) },
  order: { id: 'ASC' },
  take: MAX_CONCURRENT_UPLOADS,
};

function checkKalturaOptionsSet(): boolean {
  const { servicePartnerId, serviceTokenSecret, serviceTokenId, serviceUrl } = getSettings();
  return servicePartnerId !== 0 && !!serviceTokenSecret && !!serviceTokenId && !!serviceUrl;
}

export async function startUploadService(): Promise<void> {
  try {
    if (!checkKalturaOptionsSet() || !(await KalturaClientManager.checkConnection())) {
      throw new Error(
        'The upload service is not working: parameters are not set/there is no connection to the video host.',
      );
    }
    logger.info('Start processing entries.');
    const entries = await entryRepository.find(findOptions);
    for (const entry of entries) {
      EntryUploadManager.add(entry);
    }
  } catch (e) {
    const error = asError(e);
    logger.error(error.message, error);
  } finally {
    await deleteEntriesAfterUpload();
    setTimeout(startUploadService, UPLOAD_SERVICE_DELAY);
  }
}
