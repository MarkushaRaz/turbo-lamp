import { Action } from 'redux';
import { SETTINGS_ACTION_SET_RECORDING_PATH } from '_/shared/constants';

export interface SetRecordingPathSettingAction extends Action {
  type: typeof SETTINGS_ACTION_SET_RECORDING_PATH;
  payload: {
    recordingPath: string;
  };
}
