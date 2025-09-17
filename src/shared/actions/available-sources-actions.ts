import { RecordingSource } from '_shared/enums';
import {
  AVAILABLE_SOURCES_ACTION_GET_AUDIO_CAPTURE_SOURCES,
  AVAILABLE_SOURCES_ACTION_GET_CAMERA_CAPTURE_SOURCES,
  AVAILABLE_SOURCES_ACTION_GET_DESKTOP_CAPTURE_SOURCES,
  AVAILABLE_SOURCES_ACTION_SET_AUDIO_CAPTURE_SOURCES,
  AVAILABLE_SOURCES_ACTION_SET_CAMERA_CAPTURE_SOURCES,
  AVAILABLE_SOURCES_SET_DESKTOP_CAPTURE_SOURCES,
} from '../constants';
import { CaptureSource, GetAvailableCaptureSourcesAction, SetAvailableCaptureSourcesAction } from '../types';

export function getAvailableAudioCaptureSourcesAction(
  selectedCaptureSource?: CaptureSource,
): GetAvailableCaptureSourcesAction {
  return {
    type: AVAILABLE_SOURCES_ACTION_GET_AUDIO_CAPTURE_SOURCES,
    payload: {
      selectedCaptureSource,
    },
  };
}

export function getAvailableCameraCaptureSourcesAction(
  selectedCaptureSource?: CaptureSource,
  sourceType?: RecordingSource,
): GetAvailableCaptureSourcesAction {
  return {
    type: AVAILABLE_SOURCES_ACTION_GET_CAMERA_CAPTURE_SOURCES,
    payload: {
      selectedCaptureSource,
      sourceType,
    },
  };
}

export function getAvailableDesktopCaptureSources(
  selectedCaptureSource?: CaptureSource,
): GetAvailableCaptureSourcesAction {
  return {
    type: AVAILABLE_SOURCES_ACTION_GET_DESKTOP_CAPTURE_SOURCES,
    payload: {
      selectedCaptureSource,
    },
  };
}

export function setAvailableAudioCaptureSourcesAction(
  captureSources: CaptureSource[],
): SetAvailableCaptureSourcesAction {
  return {
    type: AVAILABLE_SOURCES_ACTION_SET_AUDIO_CAPTURE_SOURCES,
    payload: {
      captureSources,
    },
  };
}

export function setAvailableCameraCaptureSourcesAction(
  captureSources: CaptureSource[],
): SetAvailableCaptureSourcesAction {
  return {
    type: AVAILABLE_SOURCES_ACTION_SET_CAMERA_CAPTURE_SOURCES,
    payload: {
      captureSources,
    },
  };
}

export function setAvailableDesktopCaptureSourcesAction(
  captureSources: CaptureSource[],
): SetAvailableCaptureSourcesAction {
  return {
    type: AVAILABLE_SOURCES_SET_DESKTOP_CAPTURE_SOURCES,
    payload: {
      captureSources,
    },
  };
}
