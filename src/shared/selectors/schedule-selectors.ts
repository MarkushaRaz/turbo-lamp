import { createSelector } from 'reselect';
import { makeSelectSettingScheduleToken } from './settings-selectors';
import { makeSelectIsVideoCapturePossible } from './capture-sources-selectors';

export const makeSelectCanEnableSchedule = () =>
  createSelector(
    [makeSelectSettingScheduleToken(), makeSelectIsVideoCapturePossible()],
    (scheduleToken, isVideoCapturePossible) => scheduleToken && isVideoCapturePossible,
  );
