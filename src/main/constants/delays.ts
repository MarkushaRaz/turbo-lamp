import { duration } from 'moment';

export const AUTO_UPDATE_DELAY = duration(5, 'minutes').asMilliseconds();
export const UPLOAD_SERVICE_DELAY = duration(10, 'seconds').asMilliseconds();
export const CLEANUP_SERVICE_DELAY = duration(1, 'day').asMilliseconds();
export const SCHEDULE_BEACON_DELAY = duration(1, 'minute').asMilliseconds();
export const LECTURE_UPDATE_DELAY = duration(20, 'seconds').asMilliseconds();
export const RECORDING_SCHEDULER_SERVICE_FETCH_INTERVAL = duration(30, 'seconds').asMilliseconds();
export const SCHEDULED_RECORDING_SERVICE_HANDLE_MISSED_INTERVAL = duration(5, 'minutes').asMilliseconds();
export const SCHEDULED_RECORDING_SERVICE_HANDLE_UPCOMING_INTERVAL = duration(15, 'seconds').asMilliseconds();
export const SCHEDULED_COMMUNICATION_SERVICE_HANDLE_UPCOMING_INTERVAL = duration(1, 'minute').asMilliseconds();
