import { produce } from 'immer';
import {
  CAPTURE_SOURCES_ACTION_SET_AUDIO_CAPTURE_SOURCE,
  CAPTURE_SOURCES_ACTION_SET_CAMERA_CAPTURE_SOURCE,
  CAPTURE_SOURCES_ACTION_SET_DESKTOP_CAPTURE_SOURCE,
  CAPTURE_SOURCES_ACTION_TOGGLE_AUDIO_CAPTURE_SOURCE,
  CAPTURE_SOURCES_ACTION_TOGGLE_CAMERA_CAPTURE_SOURCE,
  CAPTURE_SOURCES_ACTION_TOGGLE_CAMERA_DESKTOP_AUDIO_CAPTURE_SOURCE,
  CAPTURE_SOURCES_ACTION_TOGGLE_DESKTOP_AUDIO_CAPTURE_SOURCE,
  CAPTURE_SOURCES_ACTION_TOGGLE_DESKTOP_CAPTURE_SOURCE,
} from '_shared/constants';
import { CaptureSourcesState, SetCaptureSourceAction, ToggleCaptureSourceAction } from '_shared/types';
import { captureSourcesState } from '../states';

export const captureSourcesReducer = produce(
  (draft: CaptureSourcesState, action: SetCaptureSourceAction | ToggleCaptureSourceAction) => {
    switch (action.type) {
      case CAPTURE_SOURCES_ACTION_SET_AUDIO_CAPTURE_SOURCE:
        draft.audioCaptureSource = action.payload.captureSource;
        break;
      case CAPTURE_SOURCES_ACTION_SET_CAMERA_CAPTURE_SOURCE:
        draft.cameraCaptureSource = action.payload.captureSource;
        break;
      case CAPTURE_SOURCES_ACTION_SET_DESKTOP_CAPTURE_SOURCE:
        draft.desktopCaptureSource = action.payload.captureSource;
        break;
      case CAPTURE_SOURCES_ACTION_TOGGLE_AUDIO_CAPTURE_SOURCE:
        draft.audioCaptureEnabled = action.payload.enabled;
        break;
      case CAPTURE_SOURCES_ACTION_TOGGLE_CAMERA_CAPTURE_SOURCE:
        draft.cameraCaptureEnabled = action.payload.enabled;
        break;
      case CAPTURE_SOURCES_ACTION_TOGGLE_CAMERA_DESKTOP_AUDIO_CAPTURE_SOURCE:
        draft.cameraDesktopAudioCaptureEnabled = action.payload.enabled;
        break;
      case CAPTURE_SOURCES_ACTION_TOGGLE_DESKTOP_CAPTURE_SOURCE:
        draft.desktopCaptureEnabled = action.payload.enabled;
        break;
      case CAPTURE_SOURCES_ACTION_TOGGLE_DESKTOP_AUDIO_CAPTURE_SOURCE:
        draft.desktopAudioCaptureEnabled = action.payload.enabled;
        break;
      default:
        return draft;
    }
  },
  captureSourcesState,
);
