import { RecordingState } from '_shared/types';
import { RecordingStatus } from '_shared/enums';

export const recordingState: RecordingState = {
  entry: undefined,
  recordingPathFreeSpace: undefined,
  status: RecordingStatus.Pending,
};
