import { produce } from 'immer';
import {
  LIBRARY_ACTION_SET_ENTRIES,
  LIBRARY_ACTION_SET_ERROR,
  LIBRARY_ACTION_SET_LOADING,
  LIBRARY_ACTION_SET_PAGE,
} from '_shared/constants';
import { libraryState } from '_shared/states';
import {
  LibraryState,
  SetLibraryEntriesAction,
  SetLibraryErrorAction,
  SetLibraryLoadingAction,
  SetLibraryPageAction,
} from '_shared/types';

export const libraryReducer = produce(
  (
    draft: LibraryState,
    action: SetLibraryEntriesAction | SetLibraryErrorAction | SetLibraryLoadingAction | SetLibraryPageAction,
  ) => {
    switch (action.type) {
      case LIBRARY_ACTION_SET_ENTRIES:
        draft.entries = action.payload.entries;
        draft.totalCount = action.payload.totalCount;
        break;
      case LIBRARY_ACTION_SET_ERROR:
        draft.error = action.payload.error;
        break;
      case LIBRARY_ACTION_SET_LOADING:
        draft.loading = action.payload.loading;
        break;
      case LIBRARY_ACTION_SET_PAGE:
        draft.page = action.payload.page;
        break;
      default:
        return draft;
    }
  },
  libraryState,
);
