import {
  EntryData,
  GetLibraryEntriesAction,
  SetLibraryEntriesAction,
  SetLibraryErrorAction,
  SetLibraryLoadingAction,
  SetLibraryPageAction,
} from '_shared/types';
import {
  LIBRARY_ACTION_GET_ENTRIES,
  LIBRARY_ACTION_SET_ENTRIES,
  LIBRARY_ACTION_SET_ERROR,
  LIBRARY_ACTION_SET_LOADING,
  LIBRARY_ACTION_SET_PAGE,
} from '_shared/constants';

export function getLibraryEntriesAction(count: number, page: number): GetLibraryEntriesAction {
  return {
    type: LIBRARY_ACTION_GET_ENTRIES,
    payload: {
      count,
      page,
    },
  };
}

export function setLibraryEntriesAction(entries: EntryData[], totalCount: number): SetLibraryEntriesAction {
  return {
    type: LIBRARY_ACTION_SET_ENTRIES,
    payload: {
      entries,
      totalCount,
    },
  };
}

export function setLibraryErrorAction(error: boolean): SetLibraryErrorAction {
  return {
    type: LIBRARY_ACTION_SET_ERROR,
    payload: {
      error,
    },
  };
}

export function setLibraryLoadingAction(loading: boolean): SetLibraryLoadingAction {
  return {
    type: LIBRARY_ACTION_SET_LOADING,
    payload: {
      loading,
    },
  };
}

export function setLibraryPageAction(page: number): SetLibraryPageAction {
  return {
    type: LIBRARY_ACTION_SET_PAGE,
    payload: {
      page,
    },
  };
}
