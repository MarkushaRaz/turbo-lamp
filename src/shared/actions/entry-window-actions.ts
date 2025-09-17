import { ENTRY_WINDOW_ACTION_RESET_STATE, ENTRY_WINDOW_ACTION_SET_STATE } from '_shared/constants';
import { EntryWindowMode } from '_shared/enums';
import { EntryData, ResetEntryWindowStateAction, SetEntryWindowStateAction } from '_shared/types';

export function resetEntryWindowStateAction(): ResetEntryWindowStateAction {
  return {
    type: ENTRY_WINDOW_ACTION_RESET_STATE,
  };
}

export function setEntryWindowStateAction(entry: EntryData, mode: EntryWindowMode): SetEntryWindowStateAction {
  return {
    type: ENTRY_WINDOW_ACTION_SET_STATE,
    payload: {
      entry,
      mode,
    },
  };
}
