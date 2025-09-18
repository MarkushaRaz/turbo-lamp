export interface PulseAudioConfig {
  sampleRate: number;
  channels: number;
  format: 'S16LE' | 'S24LE' | 'S32LE' | 'F32LE';
  bufferSize: number;
}