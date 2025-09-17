import { Action } from 'redux';
import { PTZ_CAMERA_ACTION_RECALL_PRESET } from '_shared/constants';

export interface RecallPtzCameraPresetAction extends Action {
  type: typeof PTZ_CAMERA_ACTION_RECALL_PRESET;
  payload: {
    presetIndex: number;
  };
}
