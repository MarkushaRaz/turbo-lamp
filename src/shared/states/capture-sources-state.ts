import { CaptureSourcesState } from '_shared/types';
import { IS_WINDOWS } from '_shared/constants';

export const captureSourcesState: CaptureSourcesState = {
  audioCaptureEnabled: false,
  audioCaptureSource: undefined,
  cameraCaptureEnabled: false,
  cameraCaptureSource: undefined,
  cameraDesktopAudioCaptureEnabled: IS_WINDOWS,
  desktopAudioCaptureEnabled: IS_WINDOWS,
  desktopCaptureEnabled: false,
  desktopCaptureSource: undefined,
};
