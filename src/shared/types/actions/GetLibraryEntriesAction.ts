import { Action } from 'redux';
import { LIBRARY_ACTION_GET_ENTRIES } from '_shared/constants';

export interface GetLibraryEntriesAction extends Action {
  type: typeof LIBRARY_ACTION_GET_ENTRIES;
  payload: {
    count: number;
    page: number;
  };
}
