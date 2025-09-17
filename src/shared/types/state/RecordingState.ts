import { EntryData } from '_shared/types/data/EntryData';
import { RecordingStatus } from '_shared/enums';

export type RecordingPathFreeSpace = number | undefined | null;

export interface RecordingState {
  entry?: EntryData;
  recordingPathFreeSpace: RecordingPathFreeSpace;
  status: RecordingStatus;
}
