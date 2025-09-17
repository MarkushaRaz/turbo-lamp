import log from 'electron-log';
import { asError } from '_shared/utils';
import { DesktopCaptureConstraints } from '_/shared/types';

const logger = log.scope('AudioVolumeMeterService');

type VolumeUpdateCallback = (volume: number) => void;

export class AudioVolumeMeterService {
  private readonly PROCESS_FREQUENCY = 50;

  private readonly SMOOTHING = 0.7;

  private readonly FFT_SIZE = 1024;

  private readonly audioDeviceId: string;

  private readonly onVolumeUpdate: VolumeUpdateCallback;

  private audioAnalyzer?: AnalyserNode;

  private audioContext?: AudioContext;

  private audioSourceNode?: MediaStreamAudioSourceNode;

  private processInterval?: NodeJS.Timeout;

  private stream: MediaStream | undefined;

  constructor(audioDeviceId: string, onVolumeUpdate: VolumeUpdateCallback) {
    this.audioDeviceId = audioDeviceId;
    this.onVolumeUpdate = onVolumeUpdate;
  }

  private calculateAverage = () => {
    if (!this.audioAnalyzer) return 0;

    const frequencyData = new Uint8Array(this.audioAnalyzer.frequencyBinCount);
    this.audioAnalyzer.getByteFrequencyData(frequencyData);

    let values = 0;
    const { length } = frequencyData;

    for (let i = 0; i < length; i += 1) {
      values += frequencyData[i];
    }

    return Math.round(values / length);
  };

  private processAudio = () => {
    const volume = this.calculateAverage();
    this.onVolumeUpdate(volume);
  };

  private handleDeviceChange = () => {
    if (['default', 'communications'].includes(this.audioDeviceId)) {
      this.stop();
      this.start();
    }
  };

  public start = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const isDesktopDevice = !devices.some(
        (device) => device.kind === 'audioinput' && device.deviceId === this.audioDeviceId,
      );
      if (isDesktopDevice) {
        const constraints: DesktopCaptureConstraints = {
          audio: { mandatory: { chromeMediaSource: 'desktop' } },
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: this.audioDeviceId ?? '',
            },
          },
        };
        this.stream = await navigator.mediaDevices.getUserMedia(constraints as MediaStreamConstraints);
      } else {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: this.audioDeviceId } });
      }
      this.audioContext = new AudioContext();
      this.audioAnalyzer = this.audioContext.createAnalyser();
      this.audioSourceNode = this.audioContext.createMediaStreamSource(this.stream);
      this.audioAnalyzer.smoothingTimeConstant = this.SMOOTHING;
      this.audioAnalyzer.fftSize = this.FFT_SIZE;
      this.audioSourceNode.connect(this.audioAnalyzer);
      this.processInterval = setInterval(this.processAudio, this.PROCESS_FREQUENCY);
    } catch (e) {
      logger.error(
        `${AudioVolumeMeterService.name}: Failed to connect to the device "${this.audioDeviceId}", ${
          asError(e).message
        }`,
        asError(e),
      );
    }
    navigator.mediaDevices.addEventListener('devicechange', this.handleDeviceChange);
  };

  public stop = () => {
    clearInterval(this.processInterval);
    this.stream?.getTracks().forEach((value) => value.stop());
    this.audioAnalyzer?.disconnect();
    this.audioSourceNode?.disconnect();
    if (this.audioContext?.state !== 'closed') this.audioContext?.close();
    navigator.mediaDevices.removeEventListener('devicechange', this.handleDeviceChange);
  };
}
