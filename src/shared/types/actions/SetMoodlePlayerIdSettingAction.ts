import { Action } from 'redux';
import { SETTINGS_ACTION_SET_MOODLE_PLAYER_ID } from '_/shared/constants';

export interface SetMoodlePlayerIdSettingAction extends Action {
  type: typeof SETTINGS_ACTION_SET_MOODLE_PLAYER_ID;
  payload: {
    moodlePlayerId: number;
  };
}
