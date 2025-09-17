import { Action } from 'redux';
import { WINDOW_ACTION_SHOW } from '_shared/constants';

export interface ShowWindowAction extends Action {
  type: typeof WINDOW_ACTION_SHOW;
}
