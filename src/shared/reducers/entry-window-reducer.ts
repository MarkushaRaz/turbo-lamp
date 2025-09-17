import { produce } from 'immer';
import { ENTRY_WINDOW_ACTION_RESET_STATE, ENTRY_WINDOW_ACTION_SET_STATE } from '_shared/constants';
import { entryWindowState } from '_shared/states';
import { EntryWindowState, ResetEntryWindowStateAction, SetEntryWindowStateAction } from '_shared/types';

export const entryWindowReducer = produce(
  (draft: EntryWindowState, action: ResetEntryWindowStateAction | SetEntryWindowStateAction) => {
    switch (action.type) {
      case ENTRY_WINDOW_ACTION_RESET_STATE:
        return entryWindowState;
      case ENTRY_WINDOW_ACTION_SET_STATE:
        draft.entry = action.payload.entry;
        draft.mode = action.payload.mode;
        break;
      default:
        return draft;
    }
  },
  entryWindowState,
);
