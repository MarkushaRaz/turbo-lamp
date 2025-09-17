import { getState } from '_main/providers';
import { Entitlement } from '_shared/enums';
import { makeSelectLicenseEntitlementsSet } from '_shared/selectors';

export function hasEntitlement(entitlement: Entitlement) {
  const entitlements = makeSelectLicenseEntitlementsSet()(getState());
  return entitlements.has(entitlement);
}
