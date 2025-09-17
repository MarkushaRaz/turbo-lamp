import {
  AVAILABLE_SOURCES_ACTION_GET_AUDIO_CAPTURE_SOURCES,
  AVAILABLE_SOURCES_ACTION_GET_CAMERA_CAPTURE_SOURCES,
  AVAILABLE_SOURCES_ACTION_GET_DESKTOP_CAPTURE_SOURCES,
} from '_shared/constants';
import { Action } from 'redux';
import { CaptureSource } from '_shared/types/capture/CaptureSource';
import { RecordingSource } from '_shared/enums';

export interface GetAvailableCaptureSourcesAction extends Action {
  type:
    | typeof AVAILABLE_SOURCES_ACTION_GET_CAMERA_CAPTURE_SOURCES
    | typeof AVAILABLE_SOURCES_ACTION_GET_DESKTOP_CAPTURE_SOURCES
    | typeof AVAILABLE_SOURCES_ACTION_GET_AUDIO_CAPTURE_SOURCES;
  payload: {
    selectedCaptureSource?: CaptureSource;
    sourceType?: RecordingSource;
  };
}
