import { RecordingSource, RecordingStatus, UploadStatus } from '_/shared/enums';

export interface RecordingData {
  id: number;
  filePath: string;
  source: RecordingSource;
  uploadStatus: UploadStatus;
  recordingStatus: RecordingStatus;
  size: number;
}
