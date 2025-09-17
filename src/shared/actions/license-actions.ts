import { LICENSE_ACTION_SET_ENTITLEMENTS } from '_shared/constants';
import { Entitlement } from '_shared/enums';
import { SetLicenseEntitlementsAction } from '_shared/types';

export function setLicenseEntitlementsAction(entitlements: Entitlement[]): SetLicenseEntitlementsAction {
  return {
    type: LICENSE_ACTION_SET_ENTITLEMENTS,
    payload: {
      entitlements,
    },
  };
}
