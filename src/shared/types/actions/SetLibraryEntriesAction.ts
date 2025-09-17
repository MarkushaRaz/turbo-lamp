import { Action } from 'redux';
import { LIBRARY_ACTION_SET_ENTRIES } from '_shared/constants';
import { EntryData } from '_shared/types/data/EntryData';

export interface SetLibraryEntriesAction extends Action {
  type: typeof LIBRARY_ACTION_SET_ENTRIES;
  payload: {
    entries: EntryData[];
    totalCount: number;
  };
}
