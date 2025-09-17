import log from 'electron-log';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { RECORDING_SCHEDULER_SERVICE_FETCH_INTERVAL } from '_main/constants';
import { Entry } from '_main/database/entities';
import { getSettings } from '_main/providers';
import { entryRepository } from '_main/database/repositories';
import { ENTRY_METADATA_SEPARATOR } from '_shared/constants';
import { EntryStatus, RecordingSource } from '_shared/enums';
import { ScheduleService } from '_shared/services';
import { Lecture, LectureStatus } from '_shared/services/schedule-service/types';
import { asError } from '_shared/utils';

const logger = log.scope('RecordingSchedulerService');

export class RecordingSchedulerService {
  private static shouldExecute = (): boolean => getSettings().scheduleEnabled;

  private static isLectureMissed(lecture: Lecture): boolean {
    const now = new Date();
    return lecture.end_time <= now;
  }

  private static async setLectureMissedInSchedule(lecture: Lecture): Promise<void> {
    try {
      logger.debug(`Trying to set lecture #${lecture.id} missed status`);
      await ScheduleService.setLectureStatus(lecture.id, LectureStatus.Missed);
    } catch (e) {
      logger.error(`Failed to mark lecture #${lecture.id} as missed in Schedule: ${asError(e).message}`, asError(e));
    }
  }

  private static async fetchLecturesFromSchedule(type: 'new' | 'stuck'): Promise<Array<Lecture>> {
    logger.debug(`Trying to fetch ${type} lectures from schedule`);
    let lectures: Array<Lecture> = [];

    try {
      const fetchMethod = type === 'new' ? ScheduleService.getNewLectures : ScheduleService.getStuckLectures;
      lectures = await fetchMethod();
    } catch (e) {
      logger.error(`Failed to fetch ${type} lectures from Schedule: ${asError(e).message}`, asError(e));
    }

    return lectures;
  }

  private static async findNewScheduledEntries(): Promise<Array<Entry>> {
    logger.debug('Find new scheduled entries');
    const findOptions: FindManyOptions<Entry> = { where: { isFromSchedule: true, status: EntryStatus.New } };
    let entries: Array<Entry> = [];

    try {
      entries = await entryRepository.find(findOptions);
    } catch (e) {
      logger.error(`Failed to find new scheduled entries in the local db: ${asError(e).message}`, asError(e));
    }

    return entries;
  }

  private static async removeScheduledEntriesForDeletedLectures(entries: Array<Entry>) {
    if (!entries || !entries.length) return;

    logger.debug('Trying to delete scheduled entries for deleted lectures');
    for (const entry of entries) {
      if (entry.isFromSchedule && entry.scheduleId) {
        try {
          if (!(await ScheduleService.checkLectureExistsInSchedule(entry.scheduleId))) {
            entryRepository
              .remove(entry)
              .catch((e) =>
                logger.error(
                  `Failed to remove the local entry for lecture #${entry.scheduleId}: ${asError(e)}`,
                  asError(e),
                ),
              );
          }
        } catch (e) {
          logger.error(`Failed to check if lecture #${entry.scheduleId} exists in Schedule: ${asError(e)}`, asError(e));
        }
      }
    }
  }

  private static async createOrUpdateEntryFromLecture(lecture: Lecture) {
    try {
      logger.debug(`Trying to update lecture #${lecture.id} from schedule.`);
      const findOptions: FindOneOptions<Entry> = { where: { scheduleId: lecture.id } };
      let entry = await entryRepository.findOne(findOptions);

      if (!entry) {
        entry = new Entry(
          lecture.title,
          [],
          true,
          lecture.id,
          lecture.start_time,
          lecture.end_time,
          lecture.moodle_cmid,
          lecture.sakai_idcs,
        );
      } else {
        entry.startTime = lecture.start_time;
        entry.endTime = lecture.end_time;
      }

      if (entry.scheduleUpdatedAt === lecture.updated_at) return;
      if (entry.status && entry.status !== EntryStatus.New) return;

      const groups = [...new Set(lecture.groups.map((group) => group.name))];
      const faculties = [...new Set(lecture.groups.map((group) => group.faculty.name.replace(',', ' ')))];

      entry.tags = lecture.tags ?? '';
      entry.description = lecture.description ?? '';
      entry.teacher = lecture.teacher.name;
      entry.email = lecture.teacher.email;
      entry.subject = lecture.subject.name;
      entry.year = lecture.year.name;
      entry.groups = groups.join(ENTRY_METADATA_SEPARATOR);
      entry.faculties = faculties.join(ENTRY_METADATA_SEPARATOR);
      entry.type = lecture.type.name;
      entry.isUnlisted = lecture.unlisted;
      entry.scheduleUpdatedAt = lecture.updated_at;
      entry.primaryChannel = lecture.primary_channel ?? RecordingSource.Camera;

      await entryRepository.save(entry);
    } catch (e) {
      logger.error(`Failed to create or update an entry for lecture #${lecture.id}: ${asError(e).message}`, asError(e));
    }
  }

  private static async handleNewOrStuckLectures(lectures: Array<Lecture>) {
    if (!lectures.length) return;

    for (const lecture of lectures) {
      if (RecordingSchedulerService.isLectureMissed(lecture)) {
        await RecordingSchedulerService.setLectureMissedInSchedule(lecture);
      } else {
        await RecordingSchedulerService.createOrUpdateEntryFromLecture(lecture);
      }
    }
  }

  private static async execute() {
    if (RecordingSchedulerService.shouldExecute()) {
      const scheduledEntries = await RecordingSchedulerService.findNewScheduledEntries();
      await RecordingSchedulerService.removeScheduledEntriesForDeletedLectures(scheduledEntries);

      const newLectures = await RecordingSchedulerService.fetchLecturesFromSchedule('new');
      await RecordingSchedulerService.handleNewOrStuckLectures(newLectures);

      const stuckLectures = await RecordingSchedulerService.fetchLecturesFromSchedule('stuck');
      await RecordingSchedulerService.handleNewOrStuckLectures(stuckLectures);
    }

    setTimeout(RecordingSchedulerService.execute, RECORDING_SCHEDULER_SERVICE_FETCH_INTERVAL);
  }

  public static start = () => {
    logger.info('Starting recording schedule service');
    // noinspection JSIgnoredPromiseFromCall
    RecordingSchedulerService.execute();
  };
}
