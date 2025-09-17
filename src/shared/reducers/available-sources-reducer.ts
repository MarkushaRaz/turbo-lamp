import { produce } from 'immer';
import {
  AVAILABLE_SOURCES_ACTION_SET_AUDIO_CAPTURE_SOURCES,
  AVAILABLE_SOURCES_ACTION_SET_CAMERA_CAPTURE_SOURCES,
  AVAILABLE_SOURCES_SET_DESKTOP_CAPTURE_SOURCES,
} from '_shared/constants';
import { AvailableSourcesState, SetAvailableCaptureSourcesAction } from '_shared/types';
import { availableSourcesState } from '../states';

export const availableSourcesReducer = produce(
  (draft: AvailableSourcesState, action: SetAvailableCaptureSourcesAction) => {
    switch (action.type) {
      case AVAILABLE_SOURCES_ACTION_SET_AUDIO_CAPTURE_SOURCES:
        draft.audioCaptureSources = action.payload.captureSources;
        break;
      case AVAILABLE_SOURCES_SET_DESKTOP_CAPTURE_SOURCES:
        draft.desktopCaptureSources = action.payload.captureSources;
        break;
      case AVAILABLE_SOURCES_ACTION_SET_CAMERA_CAPTURE_SOURCES:
        draft.cameraCaptureSources = action.payload.captureSources;
        break;
      default:
        return draft;
    }
  },
  availableSourcesState,
);
