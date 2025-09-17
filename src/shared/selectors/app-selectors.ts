import { createSelector } from 'reselect';
import { AppState, CombinedState } from '_shared/types';
import { appState } from '_shared/states';
import { CombinedStateKey } from '_shared/enums';

const selectAppDomain = (state: CombinedState): AppState => state[CombinedStateKey.App] || appState;

export const makeSelectAppState = () => createSelector(selectAppDomain, (substate: AppState) => substate);

export const makeSelectAppVersion = () => createSelector(selectAppDomain, (substate: AppState) => substate.version);

export const makeSelectFingerprint = () =>
  createSelector(selectAppDomain, (substate: AppState) => substate.fingerprint);

export const makeSelectAppUuid = () => createSelector(selectAppDomain, (substate: AppState) => substate.uuid);

export default selectAppDomain;
