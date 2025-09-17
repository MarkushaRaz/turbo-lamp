import moment from 'moment';
import { SCHEDULED_COMMUNICATION_SERVICE_HANDLE_UPCOMING_INTERVAL } from '_main/constants';
import { getSettings } from '_main/providers';
import { ScheduleService } from '_shared/services';
import { Lecture } from '_shared/services/schedule-service/types';
import log from 'electron-log';
import { CommunicationWindow } from '../../windows/CommunicationWindow';

const logger = log.scope('ScheduleCommunicationService');

export class ScheduledCommunicationService {
  private static shouldExecute = (): boolean => getSettings().scheduleCommunicationEnabled;

  private static async findClosestUpcomingLecture() {
    logger.debug('Trying to find closest upcoming lectures');
    let lectures: Lecture[] = [];

    try {
      lectures = await ScheduleService.getCurrentLectures();
    } catch (e) {
      // Ignored
    }

    const now = moment();
    for (const lecture of lectures) {
      if (now.add(10, 'seconds').isAfter(lecture.start_time) && now.isBefore(lecture.end_time)) {
        logger.debug(`Closest lecture found #${lecture.id}`);
        CommunicationWindow.open('event', lecture);
        break;
      }
    }
  }

  private static async execute() {
    if (ScheduledCommunicationService.shouldExecute() && !CommunicationWindow.isOpen) {
      await ScheduledCommunicationService.findClosestUpcomingLecture();
    }

    setTimeout(ScheduledCommunicationService.execute, SCHEDULED_COMMUNICATION_SERVICE_HANDLE_UPCOMING_INTERVAL);
  }

  public static Start() {
    logger.info('Starting scheduled communication service');
    ScheduledCommunicationService.execute();
  }
}
