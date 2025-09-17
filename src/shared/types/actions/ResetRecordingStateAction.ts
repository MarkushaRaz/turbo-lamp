import { Action } from 'redux';
import { RECORDING_ACTION_RESET_RECORDING_STATE } from '_shared/constants';

export interface ResetRecordingStateAction extends Action {
  type: typeof RECORDING_ACTION_RESET_RECORDING_STATE;
}
