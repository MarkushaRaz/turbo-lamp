import { Action } from 'redux';
import { WINDOW_ACTION_HIDE } from '_shared/constants';

export interface HideWindowAction extends Action {
  type: typeof WINDOW_ACTION_HIDE;
}
