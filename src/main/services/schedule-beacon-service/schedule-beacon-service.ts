import log from 'electron-log';
import { ScheduleService } from '_shared/services';
import { getSettings } from '_main/providers';
import { SCHEDULE_BEACON_DELAY } from '_main/constants';
import { asError } from '_shared/utils';

const logger = log.scope('ScheduleService');

function sendBeacon() {
  if (getSettings().scheduleEnabled) {
    ScheduleService.updateCurrentRoomLastOnline().catch((error) =>
      logger.error(`Couldn't send beacon to the Schedule Server: ${error.message}`, asError(error)),
    );
  }
  return sendBeacon;
}

export function startScheduleBeaconService() {
  logger.info('Starting schedule beacon service');
  setInterval(sendBeacon(), SCHEDULE_BEACON_DELAY);
}
