import { Action } from 'redux';
import { APP_ACTION_SET_APP_UUID } from '_shared/constants';

export interface SetAppUuidAction extends Action {
  type: typeof APP_ACTION_SET_APP_UUID;
  payload: {
    uuid: string;
  };
}
