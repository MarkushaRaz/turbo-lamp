import { Entitlement } from '_shared/enums';
import { makeSelectLicenseEntitlementsSet } from '_shared/selectors';
import { useSelector } from 'react-redux';

export function useEntitlement(entitlement: Entitlement) {
  const entitlements = useSelector(makeSelectLicenseEntitlementsSet());
  return entitlements.has(entitlement);
}
