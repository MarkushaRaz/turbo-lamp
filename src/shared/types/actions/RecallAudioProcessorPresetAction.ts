import { Action } from 'redux';
import { AUDIO_PROCESSOR_ACTION_RECALL_PRESET } from '_shared/constants';

export interface RecallAudioProcessorPresetAction extends Action {
  type: typeof AUDIO_PROCESSOR_ACTION_RECALL_PRESET;
  payload: {
    presetIndex: number;
  };
}
