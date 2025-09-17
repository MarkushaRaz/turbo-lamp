import { Action } from 'redux';
import { WINDOW_ACTION_MINIMIZE } from '_shared/constants';

export interface MinimizeWindowAction extends Action {
  type: typeof WINDOW_ACTION_MINIMIZE;
}
