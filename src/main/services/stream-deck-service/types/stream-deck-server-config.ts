import { StreamDeckServerState } from './stream-deck-server-state';

export interface StreamDeckServerConfig {
  audioMaxPreset?: number;
  cameraMaxPreset?: number;
  initialState?: StreamDeckServerState;
  debug?: boolean;
  ports: Array<number>;
}
