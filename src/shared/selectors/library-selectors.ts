import { createSelector } from 'reselect';
import { CombinedState, LibraryState } from '_shared/types';
import { libraryState } from '_shared/states';
import { CombinedStateKey } from '_shared/enums';

const selectLibraryDomain = (state: CombinedState): LibraryState => state[CombinedStateKey.Library] || libraryState;

export const makeSelectLibraryState = () => createSelector(selectLibraryDomain, (substate: LibraryState) => substate);

export const makeSelectLibraryEntries = () =>
  createSelector(selectLibraryDomain, (substate: LibraryState) => substate.entries);

export const makeSelectLibraryError = () =>
  createSelector(selectLibraryDomain, (substate: LibraryState) => substate.error);

export const makeSelectLibraryLoading = () =>
  createSelector(selectLibraryDomain, (substate: LibraryState) => substate.loading);

export const makeSelectLibraryTotalCount = () =>
  createSelector(selectLibraryDomain, (substate: LibraryState) => substate.totalCount);

export default selectLibraryDomain;
