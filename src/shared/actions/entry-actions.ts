import { DeleteEntryAction } from '_shared/types';
import { ENTRY_ACTION_DELETE_ENTRY } from '_shared/constants';

export function deleteEntryAction(entryId: number, markAsDeletedInSchedule?: boolean): DeleteEntryAction {
  return {
    type: ENTRY_ACTION_DELETE_ENTRY,
    payload: {
      entryId,
      markAsDeletedInSchedule,
    },
  };
}
