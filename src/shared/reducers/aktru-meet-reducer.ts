import { produce } from 'immer';
import { AKTRU_MEET_ACTION_SET_BROADCASTING } from '_shared/constants';
import { AktruMeetState, SetAktruMeetBroadcastingAction } from '_shared/types';
import { aktruMeetState } from '_shared/states';

export const aktruMeetReducer = produce((draft: AktruMeetState, action: SetAktruMeetBroadcastingAction) => {
  switch (action.type) {
    case AKTRU_MEET_ACTION_SET_BROADCASTING:
      draft.isBroadcasting = action.payload.isBroadcasting;
      break;
    default:
      return draft;
  }
}, aktruMeetState);
