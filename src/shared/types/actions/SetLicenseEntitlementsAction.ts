import { Action } from 'redux';
import { LICENSE_ACTION_SET_ENTITLEMENTS } from '_shared/constants';
import { Entitlement } from '_shared/enums';

export interface SetLicenseEntitlementsAction extends Action {
  type: typeof LICENSE_ACTION_SET_ENTITLEMENTS;
  payload: {
    entitlements: Entitlement[];
  };
}
