import {
  CAPTURE_SOURCES_ACTION_SET_AUDIO_CAPTURE_SOURCE,
  CAPTURE_SOURCES_ACTION_SET_CAMERA_CAPTURE_SOURCE,
  CAPTURE_SOURCES_ACTION_SET_DESKTOP_CAPTURE_SOURCE,
} from '_shared/constants';
import { Action } from 'redux';
import { CaptureSource } from '_shared/types/capture/CaptureSource';

export interface SetCaptureSourceAction extends Action {
  type:
    | typeof CAPTURE_SOURCES_ACTION_SET_DESKTOP_CAPTURE_SOURCE
    | typeof CAPTURE_SOURCES_ACTION_SET_CAMERA_CAPTURE_SOURCE
    | typeof CAPTURE_SOURCES_ACTION_SET_AUDIO_CAPTURE_SOURCE;
  payload: {
    captureSource?: CaptureSource;
  };
}
