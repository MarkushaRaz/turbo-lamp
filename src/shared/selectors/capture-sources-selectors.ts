import { CaptureSourcesState, CombinedState } from '_shared/types';
import { captureSourcesState } from '_shared/states';
import { createSelector } from 'reselect';
import { CombinedStateKey } from '_shared/enums';

const selectCaptureSourcesDomain = (state: CombinedState): CaptureSourcesState =>
  state[CombinedStateKey.CaptureSources] || captureSourcesState;

export const makeSelectAudioCaptureSource = () =>
  createSelector(selectCaptureSourcesDomain, (substate: CaptureSourcesState) => substate.audioCaptureSource);

export const makeSelectCameraCaptureSource = () =>
  createSelector(selectCaptureSourcesDomain, (substate: CaptureSourcesState) => substate.cameraCaptureSource);

export const makeSelectDesktopCaptureSource = () =>
  createSelector(selectCaptureSourcesDomain, (substate: CaptureSourcesState) => substate.desktopCaptureSource);

export const makeSelectAudioCaptureEnabled = () =>
  createSelector(selectCaptureSourcesDomain, (substate: CaptureSourcesState) => substate.audioCaptureEnabled);

export const makeSelectCameraCaptureEnabled = () =>
  createSelector(selectCaptureSourcesDomain, (substate: CaptureSourcesState) => substate.cameraCaptureEnabled);

export const makeSelectCameraDesktopAudioCaptureEnabled = () =>
  createSelector(
    selectCaptureSourcesDomain,
    (substate: CaptureSourcesState) => substate.cameraDesktopAudioCaptureEnabled,
  );

export const makeSelectDesktopCaptureEnabled = () =>
  createSelector(selectCaptureSourcesDomain, (substate: CaptureSourcesState) => substate.desktopCaptureEnabled);

export const makeSelectDesktopAudioCaptureEnabled = () =>
  createSelector(selectCaptureSourcesDomain, (substate: CaptureSourcesState) => substate.desktopAudioCaptureEnabled);

export const makeSelectIsVideoCapturePossible = () =>
  createSelector(
    selectCaptureSourcesDomain,
    (substate: CaptureSourcesState) =>
      (substate.cameraCaptureEnabled && !!substate.cameraCaptureSource) ||
      (substate.desktopCaptureEnabled && !!substate.desktopCaptureSource),
  );

export default selectCaptureSourcesDomain;
