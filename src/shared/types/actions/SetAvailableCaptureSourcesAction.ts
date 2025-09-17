import {
  AVAILABLE_SOURCES_ACTION_SET_AUDIO_CAPTURE_SOURCES,
  AVAILABLE_SOURCES_ACTION_SET_CAMERA_CAPTURE_SOURCES,
  AVAILABLE_SOURCES_SET_DESKTOP_CAPTURE_SOURCES,
} from '_shared/constants';
import { Action } from 'redux';
import { CaptureSource } from '_shared/types/capture';

export interface SetAvailableCaptureSourcesAction extends Action {
  type:
    | typeof AVAILABLE_SOURCES_ACTION_SET_CAMERA_CAPTURE_SOURCES
    | typeof AVAILABLE_SOURCES_ACTION_SET_AUDIO_CAPTURE_SOURCES
    | typeof AVAILABLE_SOURCES_SET_DESKTOP_CAPTURE_SOURCES;
  payload: {
    captureSources: Array<CaptureSource>;
  };
}
