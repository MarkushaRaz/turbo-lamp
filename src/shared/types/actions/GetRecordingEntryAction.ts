import { Action } from 'redux';
import { RECORDING_ACTION_GET_RECORDING_ENTRY } from '_shared/constants';

export interface GetRecordingEntryAction extends Action {
  type: typeof RECORDING_ACTION_GET_RECORDING_ENTRY;
  payload: {
    cameraCaptureEnabled: boolean;
    desktopCaptureEnabled: boolean;
  };
}
