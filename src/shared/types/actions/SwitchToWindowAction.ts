import { Action } from 'redux';
import { APP_ACTION_SWITCH_TO_WINDOW } from '_shared/constants';
import { WindowRoute } from '_shared/enums';

export interface SwitchToWindowAction extends Action {
  type: typeof APP_ACTION_SWITCH_TO_WINDOW;
  payload: {
    route: WindowRoute;
    hidden: boolean;
  };
}
