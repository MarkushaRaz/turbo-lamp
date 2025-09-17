import { Action } from 'redux';
import { APP_ACTION_QUIT_APP } from '_shared/constants';

export interface QuitAppAction extends Action {
  type: typeof APP_ACTION_QUIT_APP;
}
