import { createSelector } from 'reselect';
import { CombinedState, EntryWindowState } from '_shared/types';
import { entryWindowState } from '_shared/states';
import { CombinedStateKey } from '_shared/enums';

const selectEntryWindowDomain = (state: CombinedState): EntryWindowState =>
  state[CombinedStateKey.EntryWindow] || entryWindowState;

export const makeSelectEntryWindowState = () =>
  createSelector(selectEntryWindowDomain, (substate: EntryWindowState) => substate);

export const makeSelectEntryWindowEntry = () =>
  createSelector(selectEntryWindowDomain, (substate: EntryWindowState) => substate.entry);

export const makeSelectEntryWindowMode = () =>
  createSelector(selectEntryWindowDomain, (substate: EntryWindowState) => substate.mode);

export default selectEntryWindowDomain;
