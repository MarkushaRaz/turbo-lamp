import { createStructuredSelector } from 'reselect';
import { CombinedState } from '_shared/types';
import {
  makeSelectAudioCaptureEnabled,
  makeSelectAudioCaptureSource,
  makeSelectAudioCaptureSources,
  makeSelectCameraCaptureEnabled,
  makeSelectCameraCaptureSource,
  makeSelectCameraCaptureSources,
  makeSelectCameraDesktopAudioCaptureEnabled,
  makeSelectConnectionSettingsMissing,
  makeSelectDesktopAudioCaptureEnabled,
  makeSelectDesktopCaptureEnabled,
  makeSelectDesktopCaptureSource,
  makeSelectDesktopCaptureSources,
  makeSelectSettingDualCamModeEnabled,
  makeSelectSettingMirrorCamera,
  makeSelectSettingScheduleEnabled,
} from '_shared/selectors';
import { MainWindowStateSelection } from '_renderer/windows/MainWindow/types';

export const mainWindowStateSelector = createStructuredSelector<CombinedState, MainWindowStateSelection>({
  availableAudioCaptureSources: makeSelectAudioCaptureSources(),
  availableCameraCaptureSources: makeSelectCameraCaptureSources(),
  availableDesktopCaptureSources: makeSelectDesktopCaptureSources(),
  audioCaptureSource: makeSelectAudioCaptureSource(),
  cameraCaptureSource: makeSelectCameraCaptureSource(),
  desktopCaptureSource: makeSelectDesktopCaptureSource(),
  audioCaptureEnabled: makeSelectAudioCaptureEnabled(),
  cameraCaptureEnabled: makeSelectCameraCaptureEnabled(),
  desktopCaptureEnabled: makeSelectDesktopCaptureEnabled(),
  desktopAudioCaptureEnabled: makeSelectDesktopAudioCaptureEnabled(),
  connectionSettingsMissing: makeSelectConnectionSettingsMissing(),
  cameraDesktopAudioCaptureEnabled: makeSelectCameraDesktopAudioCaptureEnabled(),
  scheduleEnabled: makeSelectSettingScheduleEnabled(),
  dualCamModeEnabled: makeSelectSettingDualCamModeEnabled(),
  mirrorCamera: makeSelectSettingMirrorCamera(),
});
