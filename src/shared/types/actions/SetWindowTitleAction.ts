import { Action } from 'redux';
import { WINDOW_ACTION_SET_TITLE } from '_shared/constants';

export interface SetWindowTitleAction extends Action {
  type: typeof WINDOW_ACTION_SET_TITLE;
  payload: {
    title: string;
  };
}
