import { Action } from 'redux';
import { APP_ACTION_SET_FINGERPRINT } from '_shared/constants';

export interface SetFingerprintAction extends Action {
  type: typeof APP_ACTION_SET_FINGERPRINT;
  payload: {
    fingerprint: string;
  };
}
