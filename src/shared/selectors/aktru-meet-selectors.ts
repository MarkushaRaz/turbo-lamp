import { createSelector } from 'reselect';
import { CombinedState, AktruMeetState } from '_shared/types';
import { aktruMeetState } from '_shared/states';
import { CombinedStateKey } from '_shared/enums';

const selectAktruMeetDomain = (state: CombinedState): AktruMeetState =>
  state[CombinedStateKey.AktruMeet] || aktruMeetState;

export const makeSelectAktruMeetState = () =>
  createSelector(selectAktruMeetDomain, (substate: AktruMeetState) => substate);

export const makeSelectAktruMeetIsBroadcasting = () =>
  createSelector(selectAktruMeetDomain, (substate: AktruMeetState) => substate.isBroadcasting);

export default selectAktruMeetDomain;
