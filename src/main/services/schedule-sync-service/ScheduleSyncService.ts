import { LECTURE_UPDATE_DELAY } from '_main/constants';
import { Entry } from '_main/database/entities';
import { entryRepository } from '_main/database/repositories';
import { ScheduleService } from '_shared/services';
import log from 'electron-log';
import { getSettings } from '_main/providers';
import { FindOneOptions, Not, IsNull } from 'typeorm';
import moment from 'moment';
import { asError } from '_shared/utils';

const logger = log.scope('ScheduleSyncService');

export const startScheduleSyncService = async () => {
  try {
    const { scheduleEnabled } = getSettings();

    if (!scheduleEnabled) return;
    logger.debug('Starting schedule sync service');

    if (!(await ScheduleService.checkScheduleServiceAvailability())) {
      logger.warn('The schedule service is unavailable. Entry data sync will be handled on the next pass.');
      return;
    }

    const findOptions: FindOneOptions<Entry> = {
      where: { isUpdated: false, scheduleId: Not(IsNull()) },
      order: { id: 'ASC' },
    };

    const entries = await entryRepository.find(findOptions);

    for (const entry of entries) {
      try {
        if (!entry.scheduleId) continue;
        logger.debug(`Trying to sync entry #${entry.scheduleId}`);
        const lecture = await ScheduleService.setLectureStatusByEntryStatus(entry.scheduleId, entry.status);

        if (entry.primaryKalturaEntryId && !lecture.kaltura_id) {
          await ScheduleService.setLectureKalturaEntryId(entry.scheduleId, entry.primaryKalturaEntryId);
        }

        if (entry.endTime && !moment(entry.endTime, 'HH:mm:ss').isSame(moment(lecture.end_time, 'HH:mm:ss'))) {
          await ScheduleService.setLectureEndTime(entry.scheduleId, entry.endTime);
        }

        entry.updatedAt = new Date();
        entry.isUpdated = true;

        await entryRepository.save(entry, { listeners: false });
      } catch (e) {
        logger.error(asError(e).message, asError(e));
      }
    }
  } catch (e) {
    logger.error(`Failed to sync entry data with the schedule. Reason: ${(e as Error)?.message}`, asError(e));
  } finally {
    setTimeout(startScheduleSyncService, LECTURE_UPDATE_DELAY);
  }
};
