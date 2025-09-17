import { Action } from 'redux';
import { APP_ACTION_SWITCH_TO_ENTRY_WINDOW } from '_shared/constants';
import { EntryWindowMode } from '_shared/enums';
import { EntryData } from '_shared/types/data/EntryData';

export interface SwitchToEntryWindowAction extends Action {
  type: typeof APP_ACTION_SWITCH_TO_ENTRY_WINDOW;
  payload: {
    entry: EntryData;
    mode: EntryWindowMode;
  };
}
