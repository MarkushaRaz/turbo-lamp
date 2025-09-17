import { createSelector } from 'reselect';
import { CombinedState, LicenseState } from '_shared/types';
import { licenseState } from '_shared/states';
import { CombinedStateKey } from '_shared/enums';

const selectLicenseDomain = (state: CombinedState): LicenseState => state[CombinedStateKey.License] || licenseState;

export const makeSelectLicenseState = () => createSelector(selectLicenseDomain, (substate: LicenseState) => substate);

export const makeSelectLicenseEntitlements = () =>
  createSelector(selectLicenseDomain, (substate: LicenseState) => substate.entitlements);

export const makeSelectLicenseEntitlementsSet = () =>
  createSelector(selectLicenseDomain, (substate: LicenseState) => new Set(substate.entitlements));

export default selectLicenseDomain;
