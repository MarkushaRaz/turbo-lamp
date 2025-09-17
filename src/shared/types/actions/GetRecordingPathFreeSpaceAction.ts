import { Action } from 'redux';
import { RECORDING_ACTION_GET_RECORDING_PATH_FREE_SPACE } from '_shared/constants';

export interface GetRecordingPathFreeSpaceAction extends Action {
  type: typeof RECORDING_ACTION_GET_RECORDING_PATH_FREE_SPACE;
  payload: {
    recordingPath: string;
  };
}
