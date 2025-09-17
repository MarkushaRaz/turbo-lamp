import { CaptureSource, SetCaptureSourceAction, ToggleCaptureSourceAction } from '_shared/types';
import {
  CAPTURE_SOURCES_ACTION_SET_AUDIO_CAPTURE_SOURCE,
  CAPTURE_SOURCES_ACTION_SET_CAMERA_CAPTURE_SOURCE,
  CAPTURE_SOURCES_ACTION_SET_DESKTOP_CAPTURE_SOURCE,
  CAPTURE_SOURCES_ACTION_TOGGLE_AUDIO_CAPTURE_SOURCE,
  CAPTURE_SOURCES_ACTION_TOGGLE_CAMERA_CAPTURE_SOURCE,
  CAPTURE_SOURCES_ACTION_TOGGLE_CAMERA_DESKTOP_AUDIO_CAPTURE_SOURCE,
  CAPTURE_SOURCES_ACTION_TOGGLE_DESKTOP_AUDIO_CAPTURE_SOURCE,
  CAPTURE_SOURCES_ACTION_TOGGLE_DESKTOP_CAPTURE_SOURCE,
} from '../constants';

export function setAudioCaptureSourceAction(captureSource?: CaptureSource): SetCaptureSourceAction {
  return {
    type: CAPTURE_SOURCES_ACTION_SET_AUDIO_CAPTURE_SOURCE,
    payload: {
      captureSource,
    },
  };
}

export function setCameraCaptureSourceAction(captureSource?: CaptureSource): SetCaptureSourceAction {
  return {
    type: CAPTURE_SOURCES_ACTION_SET_CAMERA_CAPTURE_SOURCE,
    payload: {
      captureSource,
    },
  };
}

export function setDesktopCaptureSourceAction(captureSource?: CaptureSource): SetCaptureSourceAction {
  return {
    type: CAPTURE_SOURCES_ACTION_SET_DESKTOP_CAPTURE_SOURCE,
    payload: {
      captureSource,
    },
  };
}

export function toggleAudioCaptureSourceAction(enabled: boolean): ToggleCaptureSourceAction {
  return {
    type: CAPTURE_SOURCES_ACTION_TOGGLE_AUDIO_CAPTURE_SOURCE,
    payload: {
      enabled,
    },
  };
}

export function toggleCameraCaptureSourceAction(enabled: boolean): ToggleCaptureSourceAction {
  return {
    type: CAPTURE_SOURCES_ACTION_TOGGLE_CAMERA_CAPTURE_SOURCE,
    payload: {
      enabled,
    },
  };
}

export function toggleCameraDesktopAudioCaptureEnabledAction(enabled: boolean): ToggleCaptureSourceAction {
  return {
    type: CAPTURE_SOURCES_ACTION_TOGGLE_CAMERA_DESKTOP_AUDIO_CAPTURE_SOURCE,
    payload: {
      enabled,
    },
  };
}

export function toggleDesktopCaptureSourceAction(enabled: boolean): ToggleCaptureSourceAction {
  return {
    type: CAPTURE_SOURCES_ACTION_TOGGLE_DESKTOP_CAPTURE_SOURCE,
    payload: {
      enabled,
    },
  };
}

export function toggleDesktopAudioCaptureEnabledAction(enabled: boolean): ToggleCaptureSourceAction {
  return {
    type: CAPTURE_SOURCES_ACTION_TOGGLE_DESKTOP_AUDIO_CAPTURE_SOURCE,
    payload: {
      enabled,
    },
  };
}
