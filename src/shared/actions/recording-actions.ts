import {
  EntryData,
  GetRecordingEntryAction,
  GetRecordingPathFreeSpaceAction,
  ResetRecordingStateAction,
  SetRecordingEntryAction,
  SetRecordingPathFreeSpaceAction,
  SetRecordingStatusAction,
  UpdateRecordingEntryAction,
} from '_shared/types';
import {
  RECORDING_ACTION_GET_RECORDING_ENTRY,
  RECORDING_ACTION_GET_RECORDING_PATH_FREE_SPACE,
  RECORDING_ACTION_RESET_RECORDING_STATE,
  RECORDING_ACTION_SET_RECORDING_ENTRY,
  RECORDING_ACTION_SET_RECORDING_PATH_FREE_SPACE,
  RECORDING_ACTION_SET_RECORDING_STATUS,
  RECORDING_ACTION_UPDATE_RECORDING_ENTRY,
} from '_shared/constants';
import { RecordingStatus } from '_shared/enums';

export function getRecordingEntryAction(
  cameraCaptureEnabled: boolean,
  desktopCaptureEnabled: boolean,
): GetRecordingEntryAction {
  return {
    type: RECORDING_ACTION_GET_RECORDING_ENTRY,
    payload: {
      cameraCaptureEnabled,
      desktopCaptureEnabled,
    },
  };
}

export function getRecordingPathFreeSpaceAction(recordingPath: string): GetRecordingPathFreeSpaceAction {
  return {
    type: RECORDING_ACTION_GET_RECORDING_PATH_FREE_SPACE,
    payload: {
      recordingPath,
    },
  };
}

export function resetRecordingStateAction(): ResetRecordingStateAction {
  return {
    type: RECORDING_ACTION_RESET_RECORDING_STATE,
  };
}

export function setRecordingEntryAction(entry?: EntryData): SetRecordingEntryAction {
  return {
    type: RECORDING_ACTION_SET_RECORDING_ENTRY,
    payload: {
      entry,
    },
  };
}

export function setRecordingPathFreeSpaceAction(
  recordingPathFreeSpace: number | undefined | null,
): SetRecordingPathFreeSpaceAction {
  return {
    type: RECORDING_ACTION_SET_RECORDING_PATH_FREE_SPACE,
    payload: {
      recordingPathFreeSpace,
    },
  };
}

export function setRecordingStatusAction(status: RecordingStatus): SetRecordingStatusAction {
  return {
    type: RECORDING_ACTION_SET_RECORDING_STATUS,
    payload: {
      status,
    },
  };
}

export function updateRecordingEntryAction(entry: EntryData): UpdateRecordingEntryAction {
  return {
    type: RECORDING_ACTION_UPDATE_RECORDING_ENTRY,
    payload: {
      entry,
    },
  };
}
