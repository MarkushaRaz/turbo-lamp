import { Action } from 'redux';
import { ENTRY_ACTION_DELETE_ENTRY } from '_shared/constants';

export interface DeleteEntryAction extends Action {
  type: typeof ENTRY_ACTION_DELETE_ENTRY;
  payload: {
    entryId: number;
    markAsDeletedInSchedule?: boolean;
  };
}
