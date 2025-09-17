import { Action } from 'redux';
import { ENTRY_WINDOW_ACTION_RESET_STATE } from '_shared/constants';

export interface ResetEntryWindowStateAction extends Action {
  type: typeof ENTRY_WINDOW_ACTION_RESET_STATE;
}
