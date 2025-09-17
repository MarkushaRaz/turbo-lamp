import { CaptureSource, RecordingPathFreeSpace } from '_shared/types';
import { RecordingServiceErrorCallback } from './RecordingServiceErrorCallback';

export interface RecordingServiceOptions {
  enabledCaptures: {
    audioCaptureEnabled: boolean;
    cameraCaptureEnabled: boolean;
    cameraDesktopAudioCaptureEnabled: boolean;
    desktopAudioCaptureEnabled: boolean;
    desktopCaptureEnabled: boolean;
  };
  captureSources: {
    audioCaptureSource?: CaptureSource;
    cameraCaptureSource?: CaptureSource;
    desktopCaptureSource?: CaptureSource;
  };
  cameraSourceHeightConstraint?: ConstrainULong;
  dualCamModeEnabled: boolean;
  recorderOptions?: MediaRecorderOptions;
  recordingErrorCallback?: RecordingServiceErrorCallback;
  recordingPath: string;
  recordingPathFreeSpace: RecordingPathFreeSpace;
}
