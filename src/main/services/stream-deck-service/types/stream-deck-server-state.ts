import { SDRecorderInterfaceStates } from './sd-recorder-interface-states';
import { SDRecorderRecordingStates } from './sd-recorder-recording-states';

export interface StreamDeckServerState {
  recording: SDRecorderRecordingStates;
  cameraPreset: number;
  interface: SDRecorderInterfaceStates;
  audioPrimaryEnabled: boolean; // Left for backward compatibility with SD plugin v1.0.0
  audioPreset: number;
}
