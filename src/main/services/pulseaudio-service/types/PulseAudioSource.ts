export interface PulseAudioSource {
  name: string;
  description: string;
  index: number;
  sampleSpec: {
    format: string;
    rate: number;
    channels: number;
  };
}