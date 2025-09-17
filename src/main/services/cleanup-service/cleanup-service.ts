import moment from 'moment';
import { In } from 'typeorm';
import { CLEANUP_SERVICE_DELAY } from '_main/constants';
import { LessThanOrEqualDate } from '_main/database';
import { entryRepository } from '_main/database/repositories';
import { getSettings } from '_main/providers';
import { EntryStatus } from '_shared/enums';
import { asError } from '_shared/utils';
import log from 'electron-log';

const logger = log.scope('CleanUpSession');

const DAYS_TO_KEEP_MISSED_ENTRIES = 7;

async function deleteOldEntries() {
  if (getSettings().daysToKeepData !== 0) {
    try {
      logger.info('Trying to delete old entries');

      const status = In([EntryStatus.Uploaded, EntryStatus.Failed]);
      const createdAt = LessThanOrEqualDate(moment().subtract(getSettings().daysToKeepData, 'days'));
      const baseCondition = { status, createdAt };

      await entryRepository.remove(
        await entryRepository.findBy([
          {
            ...baseCondition,
            isFromSchedule: false,
          },
          {
            ...baseCondition,
            isFromSchedule: true,
            isUpdated: true,
          },
        ]),
      );
    } catch (e) {
      logger.error(asError(e).message, asError(e));
    }
  }

  setTimeout(deleteOldEntries, CLEANUP_SERVICE_DELAY);
}

async function deleteOldMissedEntries() {
  try {
    logger.info('Trying to delete old missed entries');
    await entryRepository.remove(
      await entryRepository.findBy({
        status: In([EntryStatus.Missed]),
        createdAt: LessThanOrEqualDate(moment().subtract(DAYS_TO_KEEP_MISSED_ENTRIES, 'days')),
      }),
    );
  } catch (e) {
    logger.error(asError(e).message, asError(e));
  }

  setTimeout(deleteOldMissedEntries, CLEANUP_SERVICE_DELAY);
}

export async function deleteEntriesAfterUpload() {
  if (!getSettings().deleteAfterUpload) return;
  try {
    logger.info('Trying to delete entries after upload');

    const status = EntryStatus.Uploaded;

    await entryRepository.remove(
      await entryRepository.findBy([
        { status, isFromSchedule: false },
        { status, isFromSchedule: true, isUpdated: true },
      ]),
    );
  } catch (e) {
    logger.error(asError(e).message, asError(e));
  }
}

export async function startCleanupService() {
  logger.info('Starting cleanup service');
  await deleteOldEntries();
  await deleteOldMissedEntries();
}
