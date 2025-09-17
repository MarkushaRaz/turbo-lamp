import { createSelector } from 'reselect';
import { CombinedState, RecordingState } from '_shared/types';
import { recordingState } from '_shared/states';
import { CombinedStateKey } from '_shared/enums';

const selectRecordingDomain = (state: CombinedState): RecordingState =>
  state[CombinedStateKey.Recording] || recordingState;

export const makeSelectRecordingState = () =>
  createSelector(selectRecordingDomain, (substate: RecordingState) => substate);

export const makeSelectRecordingEntry = () =>
  createSelector(selectRecordingDomain, (substate: RecordingState) => substate.entry);

export const makeSelectRecordingPathFreeSpace = () =>
  createSelector(selectRecordingDomain, (substate: RecordingState) => substate.recordingPathFreeSpace);

export const makeSelectRecordingStatus = () =>
  createSelector(selectRecordingDomain, (substate: RecordingState) => substate.status);

export default selectRecordingDomain;
