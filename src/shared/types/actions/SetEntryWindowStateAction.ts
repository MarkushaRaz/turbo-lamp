import { Action } from 'redux';
import { ENTRY_WINDOW_ACTION_SET_STATE } from '_shared/constants';
import { EntryWindowMode } from '_shared/enums';
import { EntryData } from '_shared/types/data/EntryData';

export interface SetEntryWindowStateAction extends Action {
  type: typeof ENTRY_WINDOW_ACTION_SET_STATE;
  payload: {
    entry: EntryData;
    mode: EntryWindowMode;
  };
}
