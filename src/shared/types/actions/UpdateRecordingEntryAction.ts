import { Action } from 'redux';
import { RECORDING_ACTION_UPDATE_RECORDING_ENTRY } from '_shared/constants';
import { EntryData } from '_shared/types/data/EntryData';

export interface UpdateRecordingEntryAction extends Action {
  type: typeof RECORDING_ACTION_UPDATE_RECORDING_ENTRY;
  payload: {
    entry: EntryData;
  };
}
