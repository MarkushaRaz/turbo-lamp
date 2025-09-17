import { produce } from 'immer';
import {
  RECORDING_ACTION_RESET_RECORDING_STATE,
  RECORDING_ACTION_SET_RECORDING_ENTRY,
  RECORDING_ACTION_SET_RECORDING_PATH_FREE_SPACE,
  RECORDING_ACTION_SET_RECORDING_STATUS,
} from '_shared/constants';
import { recordingState } from '_shared/states';
import {
  RecordingState,
  ResetRecordingStateAction,
  SetRecordingEntryAction,
  SetRecordingPathFreeSpaceAction,
  SetRecordingStatusAction,
} from '_shared/types';

export const recordingReducer = produce(
  (
    draft: RecordingState,
    action:
      | ResetRecordingStateAction
      | SetRecordingEntryAction
      | SetRecordingPathFreeSpaceAction
      | SetRecordingStatusAction,
  ) => {
    switch (action.type) {
      case RECORDING_ACTION_RESET_RECORDING_STATE:
        return recordingState;
      case RECORDING_ACTION_SET_RECORDING_ENTRY:
        draft.entry = action.payload.entry;
        break;
      case RECORDING_ACTION_SET_RECORDING_PATH_FREE_SPACE:
        draft.recordingPathFreeSpace = action.payload.recordingPathFreeSpace;
        break;
      case RECORDING_ACTION_SET_RECORDING_STATUS:
        draft.status = action.payload.status;
        break;
      default:
        return draft;
    }
  },
  recordingState,
);
