import { CaptureSource } from '_shared/types/capture/CaptureSource';

export interface CaptureSourcesState {
  audioCaptureEnabled: boolean;
  audioCaptureSource?: CaptureSource;
  cameraCaptureEnabled: boolean;
  cameraCaptureSource?: CaptureSource;
  cameraDesktopAudioCaptureEnabled: boolean;
  desktopAudioCaptureEnabled: boolean;
  desktopCaptureEnabled: boolean;
  desktopCaptureSource?: CaptureSource;
}
