import { Action } from 'redux';
import { APP_ACTION_SHOW_ERROR_BOX } from '_shared/constants';

export interface ShowErrorBoxAction extends Action {
  type: typeof APP_ACTION_SHOW_ERROR_BOX;
  payload: {
    title: string;
    content: string;
  };
}
