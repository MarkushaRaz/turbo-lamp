import { produce } from 'immer';
import {
  SetMoodlePlayerIdSettingAction,
  SetMultipleSettingsAction,
  SetRecordingPathSettingAction,
  SettingsState,
} from '_shared/types';
import { settingsState } from '_shared/states';
import {
  SETTINGS_ACTION_SET_MOODLE_PLAYER_ID,
  SETTINGS_ACTION_SET_MULTIPLE,
  SETTINGS_ACTION_SET_RECORDING_PATH,
} from '_shared/constants';

export const settingsReducer = produce(
  (
    draft: SettingsState,
    action: SetMoodlePlayerIdSettingAction | SetMultipleSettingsAction | SetRecordingPathSettingAction,
  ) => {
    switch (action.type) {
      case SETTINGS_ACTION_SET_MOODLE_PLAYER_ID:
        draft.moodlePlayerId = action.payload.moodlePlayerId;
        break;
      case SETTINGS_ACTION_SET_MULTIPLE:
        return { ...draft, ...action.payload.settings };
      case SETTINGS_ACTION_SET_RECORDING_PATH:
        draft.recordingPath = action.payload.recordingPath;
        break;
      default:
        return draft;
    }
  },
  settingsState,
);
