import {
  SetMoodlePlayerIdSettingAction,
  SetMultipleSettingsAction,
  SetRecordingPathSettingAction,
  SettingsState,
} from '_shared/types';
import {
  SETTINGS_ACTION_SET_MOODLE_PLAYER_ID,
  SETTINGS_ACTION_SET_MULTIPLE,
  SETTINGS_ACTION_SET_RECORDING_PATH,
} from '_shared/constants';

export function setMultipleSettingsAction(settings: Partial<SettingsState>): SetMultipleSettingsAction {
  return {
    type: SETTINGS_ACTION_SET_MULTIPLE,
    payload: {
      settings,
    },
  };
}

export function setMoodlePlayerIdSettingAction(moodlePlayerId: number): SetMoodlePlayerIdSettingAction {
  return {
    type: SETTINGS_ACTION_SET_MOODLE_PLAYER_ID,
    payload: {
      moodlePlayerId,
    },
  };
}

export function setRecordingPathSettingAction(recordingPath: string): SetRecordingPathSettingAction {
  return {
    type: SETTINGS_ACTION_SET_RECORDING_PATH,
    payload: {
      recordingPath,
    },
  };
}
