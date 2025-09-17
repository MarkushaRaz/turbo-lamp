import { Action } from 'redux';
import { RECORDING_ACTION_SET_RECORDING_PATH_FREE_SPACE } from '_shared/constants';
import { RecordingPathFreeSpace } from '_shared/types/state/RecordingState';

export interface SetRecordingPathFreeSpaceAction extends Action {
  type: typeof RECORDING_ACTION_SET_RECORDING_PATH_FREE_SPACE;
  payload: {
    recordingPathFreeSpace: RecordingPathFreeSpace;
  };
}
