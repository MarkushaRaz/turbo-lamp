import { CaptureSource, EntryData, RecordingPathFreeSpace } from '_shared/types';
import { AudioBitrate, RecordingStatus, VideoBitrate, VideoCodec, VideoResolution } from '_shared/enums';

export interface RecordingWindowStateSelection {
  aktruMeetIsBroadcasting: boolean;
  audioBitrate: AudioBitrate;
  audioCaptureEnabled: boolean;
  audioCaptureSource?: CaptureSource;
  availableCameraCaptureSources: CaptureSource[];
  availableDesktopCaptureSources: CaptureSource[];
  cameraCaptureEnabled: boolean;
  cameraCaptureSource?: CaptureSource;
  cameraDesktopAudioCaptureEnabled: boolean;
  desktopAudioCaptureEnabled: boolean;
  desktopCaptureEnabled: boolean;
  desktopCaptureSource?: CaptureSource;
  dualCamModeEnabled: boolean;
  entry?: EntryData;
  mirrorCamera: boolean;
  ptzCameraControlsEnabled: boolean;
  ptzCameraDefaultPresetIndex: number;
  recordingPath: string;
  recordingPathFreeSpace: RecordingPathFreeSpace;
  resetPtzCameraPreset: boolean;
  scheduleEnabled: boolean;
  status: RecordingStatus;
  videoBitrate: VideoBitrate;
  videoCodec: VideoCodec;
  videoResolution: VideoResolution;
}
