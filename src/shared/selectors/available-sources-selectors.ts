import { AvailableSourcesState, CombinedState } from '_shared/types';
import { availableSourcesState } from '_shared/states';
import { createSelector } from 'reselect';
import { CombinedStateKey } from '_shared/enums';

const selectAvailableSourcesDomain = (state: CombinedState): AvailableSourcesState =>
  state[CombinedStateKey.AvailableSources] || availableSourcesState;

export const makeSelectAvailableSources = () =>
  createSelector(selectAvailableSourcesDomain, (substate: AvailableSourcesState) => substate);

export const makeSelectCameraCaptureSources = () =>
  createSelector(selectAvailableSourcesDomain, (substate: AvailableSourcesState) => substate.cameraCaptureSources);

export const makeSelectAudioCaptureSources = () =>
  createSelector(selectAvailableSourcesDomain, (substate: AvailableSourcesState) => substate.audioCaptureSources);

export const makeSelectDesktopCaptureSources = () =>
  createSelector(selectAvailableSourcesDomain, (substate: AvailableSourcesState) => substate.desktopCaptureSources);

export default selectAvailableSourcesDomain;
