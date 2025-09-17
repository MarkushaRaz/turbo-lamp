import { APP_ACTION_SET_APP_VERSION } from '_shared/constants';
import { Action } from 'redux';

export interface SetAppVersionAction extends Action {
  type: typeof APP_ACTION_SET_APP_VERSION;
  payload: {
    version: string;
  };
}
