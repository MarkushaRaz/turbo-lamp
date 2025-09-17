import { Action } from 'redux';
import { AKTRU_MEET_ACTION_SET_BROADCASTING } from '_shared/constants';

export interface SetAktruMeetBroadcastingAction extends Action {
  type: typeof AKTRU_MEET_ACTION_SET_BROADCASTING;
  payload: {
    isBroadcasting: boolean;
  };
}
