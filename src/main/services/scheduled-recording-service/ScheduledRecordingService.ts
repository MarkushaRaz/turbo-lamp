import log from 'electron-log';
import moment from 'moment';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
import {
  SCHEDULED_RECORDING_SERVICE_HANDLE_MISSED_INTERVAL,
  SCHEDULED_RECORDING_SERVICE_HANDLE_UPCOMING_INTERVAL,
} from '_main/constants';
import { LessThanOrEqualDate, MoreThanDate } from '_main/database';
import { Entry } from '_main/database/entities';
import { getEntryWindowMode, getRecordingState, getSettings } from '_main/providers';
import { entryRepository } from '_main/database/repositories';
import { RecordingWindow } from '_main/windows';
import { windowManager } from '_main/window-manager';
import { EntryStatus, EntryWindowMode, RecordingStatus, WindowRoute } from '_shared/enums';
import { ScheduleService } from '_shared/services';
import { LectureStatus } from '_shared/services/schedule-service/types';
import { asError } from '_shared/utils';

const logger = log.scope('ScheduleRecordingService');

export class ScheduledRecordingService {
  private static startRecordingTimeout: NodeJS.Timeout | null;

  private static shouldExecute = (): boolean =>
    getSettings().scheduleEnabled &&
    getRecordingState().status !== RecordingStatus.Started &&
    getRecordingState().status !== RecordingStatus.Paused &&
    getEntryWindowMode() !== EntryWindowMode.Edit;

  private static async startRecording() {
    if (
      ScheduledRecordingService.shouldExecute() &&
      windowManager.getCurrentWindow()?.className !== RecordingWindow.name
    ) {
      logger.info('Starting recording');
      await windowManager.load(WindowRoute.RecordingWindow);
    }

    ScheduledRecordingService.startRecordingTimeout = null;
  }

  private static async handleMissed(): Promise<void> {
    if (ScheduledRecordingService.shouldExecute()) {
      try {
        const findOptions: FindManyOptions<Entry> = {
          where: {
            isFromSchedule: true,
            status: In([EntryStatus.New, EntryStatus.Pending]),
            endTime: LessThanOrEqualDate(moment()),
          },
        };

        const entries = await entryRepository.find(findOptions);

        for (const entry of entries) {
          entry.status = EntryStatus.Missed;
          try {
            logger.debug(`Trying to mark lecture #${entry.id} as missed`);
            await entryRepository.save(entry);
          } catch (e) {
            logger.error(`Failed to mark entry #${entry.id} as missed: ${asError(e).message}`);
          }
        }
      } catch (e) {
        logger.error(`Failed to check for missed entries: ${asError(e).message}`, asError(e));
      }
    }

    setTimeout(ScheduledRecordingService.handleMissed, SCHEDULED_RECORDING_SERVICE_HANDLE_MISSED_INTERVAL);
  }

  private static async handleUpcoming() {
    if (ScheduledRecordingService.shouldExecute() && !ScheduledRecordingService.startRecordingTimeout) {
      try {
        const findOptions: FindOneOptions<Entry> = {
          where: {
            isFromSchedule: true,
            status: In([EntryStatus.New, EntryStatus.Pending]),
            startTime: LessThanOrEqualDate(moment().add(30, 'seconds')),
            endTime: MoreThanDate(moment()),
          },
          order: { startTime: 'ASC' },
        };

        const entry = await entryRepository.findOne(findOptions);

        if (entry) {
          if (entry.status !== EntryStatus.Pending) {
            entry.status = EntryStatus.Pending;
            await entryRepository.save(entry);

            if (entry.scheduleId) {
              try {
                logger.debug(`Trying to mark lecture #${entry.id} as starting in schedule`);
                await ScheduleService.setLectureStatus(entry.scheduleId, LectureStatus.Starting);
              } catch (e) {
                logger.warn(
                  `Failed to mark lecture #${entry.scheduleId} as starting in Schedule: ${asError(e).message}`,
                  asError(e),
                );
              }
            }
          }

          const now = new Date();
          let startRecordingIn = entry.startTime.valueOf() - now.valueOf();
          if (startRecordingIn <= 0) startRecordingIn = 1000;

          ScheduledRecordingService.startRecordingTimeout = setTimeout(
            ScheduledRecordingService.startRecording,
            startRecordingIn,
          );
        }
      } catch (e) {
        logger.error(`Failed to check for upcoming lectures: ${asError(e).message}`);
      }
    }

    setTimeout(ScheduledRecordingService.handleUpcoming, SCHEDULED_RECORDING_SERVICE_HANDLE_UPCOMING_INTERVAL);
  }

  public static isRecordingPending() {
    return !!ScheduledRecordingService.startRecordingTimeout;
  }

  public static start() {
    logger.info('Starting scheduled recording service');
    // noinspection JSIgnoredPromiseFromCall
    ScheduledRecordingService.handleMissed();
    // noinspection JSIgnoredPromiseFromCall
    ScheduledRecordingService.handleUpcoming();
  }
}
