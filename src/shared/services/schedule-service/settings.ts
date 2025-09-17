import log from 'electron-log';
import { ProcessEnvKey } from '_shared/enums';

const logger = log.scope('ScheduleApiClient');

export function getScheduleToken(): string | undefined {
  logger.info(`Get schedule token`);
  return process.env[ProcessEnvKey.SCHEDULE_TOKEN];
}

export function getScheduleTrustedCA(): string | undefined {
  logger.info(`Get schedule trusted CA`);
  return process.env[ProcessEnvKey.SCHEDULE_TRUSTED_CA];
}
