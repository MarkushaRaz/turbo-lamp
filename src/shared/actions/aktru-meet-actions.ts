import { SetAktruMeetBroadcastingAction } from '_shared/types';
import { AKTRU_MEET_ACTION_SET_BROADCASTING } from '_shared/constants';

export function setAktruMeetBroadcastingAction(isBroadcasting: boolean): SetAktruMeetBroadcastingAction {
  return {
    type: AKTRU_MEET_ACTION_SET_BROADCASTING,
    payload: {
      isBroadcasting,
    },
  };
}
