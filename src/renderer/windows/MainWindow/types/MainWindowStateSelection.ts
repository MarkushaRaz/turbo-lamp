import { CaptureSource } from '_shared/types';

export interface MainWindowStateSelection {
  availableAudioCaptureSources: Array<CaptureSource>;
  availableCameraCaptureSources: Array<CaptureSource>;
  availableDesktopCaptureSources: Array<CaptureSource>;
  audioCaptureSource?: CaptureSource;
  cameraCaptureSource?: CaptureSource;
  desktopCaptureSource?: CaptureSource;
  audioCaptureEnabled: boolean;
  cameraCaptureEnabled: boolean;
  cameraDesktopAudioCaptureEnabled: boolean;
  desktopCaptureEnabled: boolean;
  desktopAudioCaptureEnabled: boolean;
  connectionSettingsMissing: boolean;
  scheduleEnabled: boolean;
  dualCamModeEnabled: boolean;
  mirrorCamera: boolean;
}
