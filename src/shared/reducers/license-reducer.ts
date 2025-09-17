import { produce } from 'immer';
import { LICENSE_ACTION_SET_ENTITLEMENTS } from '_shared/constants';
import { Entitlement } from '_shared/enums';
import { licenseState } from '_shared/states';
import { LicenseState, SetLicenseEntitlementsAction } from '_shared/types';

export const licenseReducer = produce((draft: LicenseState, action: SetLicenseEntitlementsAction) => {
  switch (action.type) {
    case LICENSE_ACTION_SET_ENTITLEMENTS:
      draft.entitlements = Array.from(new Set(action.payload.entitlements)).filter((entitlement) =>
        Object.values(Entitlement).includes(entitlement),
      );
      break;
    default:
      return draft;
  }
}, licenseState);
