import { RecallPtzCameraPresetAction } from '_shared/types';
import { PTZ_CAMERA_ACTION_RECALL_PRESET } from '_shared/constants';

export function recallPtzCameraPresetAction(presetIndex: number): RecallPtzCameraPresetAction {
  return {
    type: PTZ_CAMERA_ACTION_RECALL_PRESET,
    payload: {
      presetIndex,
    },
  };
}
