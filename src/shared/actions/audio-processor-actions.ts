import { RecallAudioProcessorPresetAction } from '_shared/types';
import { AUDIO_PROCESSOR_ACTION_RECALL_PRESET } from '_shared/constants';

export function recallAudioProcessorPresetAction(presetIndex: number): RecallAudioProcessorPresetAction {
  return {
    type: AUDIO_PROCESSOR_ACTION_RECALL_PRESET,
    payload: {
      presetIndex,
    },
  };
}
