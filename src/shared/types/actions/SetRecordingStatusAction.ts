import { Action } from 'redux';
import { RECORDING_ACTION_SET_RECORDING_STATUS } from '_shared/constants';
import { RecordingStatus } from '_shared/enums';

export interface SetRecordingStatusAction extends Action {
  type: typeof RECORDING_ACTION_SET_RECORDING_STATUS;
  payload: {
    status: RecordingStatus;
  };
}
