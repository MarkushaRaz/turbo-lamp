import _ from 'lodash';
import { filesize } from 'filesize';
import fs from 'fs';
import path from 'path';
import { i18n } from '_renderer/localization';
import { RecordingSource } from '_shared/enums';
import log from 'electron-log';
import { CaptureSource, DesktopCaptureConstraints, RecordingPathFreeSpace } from '_shared/types';
import { IS_WINDOWS } from '_shared/constants';
import { asError } from '_/shared/utils';
import { PulseAudioRecordingManager, PulseAudioService } from '_main/services/pulseaudio-service';
import {
  NullableMediaStream,
  RecordingServiceErrorCallback,
  RecordingServiceFilePaths,
  RecordingServiceOptions,
} from '../types';
import { ReplaceMediaTrackFunction, createChangeableStreamCanvas } from './media-functions';

const logger = log.scope('RecordingService');

export class RecordingService {
  private static readonly timeSliceFrequency = 1000;

  private static readonly durationCounterFrequency = 500;

  private static readonly minimumFreeSpace = 5368706371;

  private static readonly defaultCameraSourceHeightConstraint: ConstrainULong = {
    ideal: 1080,
  };

  private static readonly defaultRecorderOptions: MediaRecorderOptions = {
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 1500000,
    mimeType: 'video/webm; codecs=vp9',
  };

  private readonly audioCaptureEnabled: boolean;

  private audioCaptureSource?: CaptureSource;

  private audioCaptureDeviceAttached = true;

  private audioStream: NullableMediaStream;

  private readonly cameraCaptureEnabled: boolean;

  private readonly cameraCaptureSource?: CaptureSource;

  private readonly cameraDesktopAudioCaptureEnabled: boolean = false;

  private cameraStream: NullableMediaStream;

  private cameraStreamDisconnectAudio?: () => void;

  private cameraStreamReplaceFunction?: ReplaceMediaTrackFunction;

  private cameraRecorder?: MediaRecorder;

  private cameraRecorderActive = false;

  private cameraFilePath?: string;

  private cameraDataFlushError = false;

  private readonly cameraSourceHeightConstraint: ConstrainULong;

  private readonly desktopCaptureEnabled: boolean;

  private readonly desktopAudioCaptureEnabled: boolean = false;

  private readonly desktopCaptureSource?: CaptureSource;

  private desktopAudioStream: NullableMediaStream;

  private desktopStream: NullableMediaStream;

  private desktopStreamDisconnectAudio?: () => void;

  private desktopStreamReplaceFunction?: ReplaceMediaTrackFunction;

  private desktopRecorder?: MediaRecorder;

  private desktopRecorderActive = false;

  private desktopFilePath?: string;

  private desktopDataFlushError = false;

  private readonly dualCamModeEnabled;

  private readonly recorderOptions?: MediaRecorderOptions;

  private recordingErrorCallback?: RecordingServiceErrorCallback;

  private readonly recordingPath: string;

  private readonly recordingPathFreeSpace: RecordingPathFreeSpace;

  private isCanceled = false;

  private duration = 0;

  private durationCounterInterval?: NodeJS.Timeout;

  private audioContext: AudioContext;

  private audioStreamDestinationDesktop: MediaStreamAudioDestinationNode;

  private audioStreamDestinationCamera: MediaStreamAudioDestinationNode;

  private pulseAudioManager: PulseAudioRecordingManager | null = null;

  constructor(options: RecordingServiceOptions) {
    logger.debug('Recording service initialization. Options:', JSON.stringify(options));
    this.audioCaptureEnabled = options.enabledCaptures.audioCaptureEnabled;
    this.cameraCaptureEnabled = options.enabledCaptures.cameraCaptureEnabled;
    this.desktopCaptureEnabled = options.enabledCaptures.desktopCaptureEnabled;

    if (IS_WINDOWS) {
      this.cameraDesktopAudioCaptureEnabled = options.enabledCaptures.cameraDesktopAudioCaptureEnabled;
      this.desktopAudioCaptureEnabled = options.enabledCaptures.desktopAudioCaptureEnabled;
    }

    this.audioCaptureSource = options.captureSources.audioCaptureSource;
    this.cameraCaptureSource = options.captureSources.cameraCaptureSource;
    this.desktopCaptureSource = options.captureSources.desktopCaptureSource;

    this.cameraSourceHeightConstraint = _.defaults(
      options.cameraSourceHeightConstraint,
      RecordingService.defaultCameraSourceHeightConstraint,
    );

    this.dualCamModeEnabled = options.dualCamModeEnabled;

    this.recorderOptions = _.defaults(options.recorderOptions, RecordingService.defaultRecorderOptions);

    this.recordingErrorCallback = options.recordingErrorCallback;

    this.recordingPath = options.recordingPath;
    this.recordingPathFreeSpace = options.recordingPathFreeSpace;

    this.audioContext = new AudioContext();
    this.audioStreamDestinationDesktop = this.audioContext.createMediaStreamDestination();
    this.audioStreamDestinationCamera = this.audioContext.createMediaStreamDestination();

    // Инициализируем PulseAudio менеджер для UNIX систем
    if (!IS_WINDOWS) {
      // Проверяем доступность PulseAudio перед инициализацией
      PulseAudioService.initializePulseAudio().then((initialized) => {
        if (initialized) {
          this.pulseAudioManager = PulseAudioRecordingManager.getInstance();
          logger.info('PulseAudio recording manager initialized');
        } else {
          logger.warn('PulseAudio not available, system audio recording disabled');
        }
      }).catch((error) => {
        logger.error('Failed to initialize PulseAudio', asError(error));
      });
    }
  }

  private static appendFile = async (filePath: string, data: Blob): Promise<void> => {
    const buffer = Buffer.from(await data.arrayBuffer());
    fs.appendFileSync(filePath, buffer);
  };

  private static deleteFile = (filePath: string): void => {
    try {
      if (!fs.existsSync(filePath)) return;
      fs.unlinkSync(filePath);
      logger.info(`Unlink file: ${filePath}`);
    } catch (e) {
      logger.error(asError(e).message, asError(e));
    }
  };

  private incrementDuration = () => {
    if (this.cameraRecorder?.state === 'recording' || this.desktopRecorder?.state === 'recording') {
      this.duration += RecordingService.durationCounterFrequency / 1000;
    }
  };

  public initialize = (): Promise<void> =>
    this.checkAvailableDiskSpace().then(this.initializeStreams).then(this.initializeRecorders);

  public startRecording = (paths: RecordingServiceFilePaths): void => {
    Object.values(paths).forEach((filePath?) => {
      if (!filePath) return;
      const directory = path.dirname(filePath);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
    });

    this.cameraFilePath = paths.cameraFilePath;
    this.desktopFilePath = paths.desktopFilePath;

    this.cameraDataFlushError = false;
    this.desktopDataFlushError = false;
    this.isCanceled = false;

    // Запускаем запись системного звука через PulseAudio на UNIX системах
    if (this.pulseAudioManager && (this.desktopAudioCaptureEnabled || this.cameraDesktopAudioCaptureEnabled)) {
      const baseRecordingPath = this.desktopFilePath || this.cameraFilePath;
      if (baseRecordingPath) {
        this.pulseAudioManager.startSystemAudioRecording(baseRecordingPath).catch((error) => {
          logger.warn('PulseAudio recording failed to start', asError(error));
        });
      }
    }

    if (this.cameraFilePath && this.cameraRecorder?.state !== 'recording') {
      RecordingService.deleteFile(this.cameraFilePath);
      this.cameraRecorder?.start(RecordingService.timeSliceFrequency);
      this.cameraRecorderActive = true;
    }

    if (this.desktopFilePath && this.desktopRecorder?.state !== 'recording') {
      RecordingService.deleteFile(this.desktopFilePath);
      this.desktopRecorder?.start(RecordingService.timeSliceFrequency);
      this.desktopRecorderActive = true;
    }

    this.durationCounterInterval = setInterval(this.incrementDuration, RecordingService.durationCounterFrequency);
  };

  public pauseRecording = (): void => {
    if (this.cameraRecorder?.state !== 'paused') {
      this.cameraRecorder?.pause();
    }

    if (this.desktopRecorder?.state !== 'paused') {
      this.desktopRecorder?.pause();
    }

    // Приостанавливаем запись PulseAudio
    if (this.pulseAudioManager?.isRecording()) {
      this.pulseAudioManager.pauseSystemAudioRecording();
    }
  };

  public resumeRecording = (): void => {
    if (this.cameraRecorder?.state !== 'recording') {
      this.cameraRecorder?.resume();
    }

    if (this.desktopRecorder?.state !== 'recording') {
      this.desktopRecorder?.resume();
    }

    // Возобновляем запись PulseAudio
    if (this.pulseAudioManager?.isRecording()) {
      this.pulseAudioManager.resumeSystemAudioRecording();
    }
  };

  public stopRecording = (): Promise<void> => {
    if (this.cameraRecorder?.state !== 'inactive') {
      this.cameraRecorder?.stop();
    }

    if (this.desktopRecorder?.state !== 'inactive') {
      this.desktopRecorder?.stop();
    }

    // Останавливаем запись PulseAudio
    const pulseAudioStopPromise = this.pulseAudioManager?.stopSystemAudioRecording() || Promise.resolve();

    return new Promise((resolve) => {
      const waitUntilStopped = () => {
        if (this.cameraRecorderActive || this.desktopRecorderActive) {
          setTimeout(waitUntilStopped, 50);
        } else {
          clearInterval(this.durationCounterInterval);
          // Ждем завершения PulseAudio записи
          pulseAudioStopPromise.then(() => resolve()).catch(() => resolve());
        }
      };
      waitUntilStopped();
    });
  };

  public cancelRecording = (): Promise<void> => {
    this.isCanceled = true;
    
    // Останавливаем PulseAudio запись при отмене
    if (this.pulseAudioManager?.isRecording()) {
      this.pulseAudioManager.stopSystemAudioRecording().catch((error) => {
        logger.warn('Failed to stop PulseAudio recording during cancellation', asError(error));
      });
    }
    
    return this.stopRecording();
  };

  private static enableAudioTracks = (stream: NullableMediaStream, enabled: boolean): void => {
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
  };

  private static isAudioTrackEnabled = (stream: NullableMediaStream): boolean | undefined => {
    return stream?.getAudioTracks().some((track) => track.enabled);
  };

  public isMicAudioMuted = () => !RecordingService.isAudioTrackEnabled(this.audioStream);

  public isDesktopAudioMuted = () => !RecordingService.isAudioTrackEnabled(this.desktopAudioStream);

  public muteMicAudio = () => RecordingService.enableAudioTracks(this.audioStream, false);

  public unmuteMicAudio = () => RecordingService.enableAudioTracks(this.audioStream, true);

  public muteDesktopAudio = () => RecordingService.enableAudioTracks(this.desktopAudioStream, false);

  public unmuteDesktopAudio = () => RecordingService.enableAudioTracks(this.desktopAudioStream, true);

  public getCameraStream = (): NullableMediaStream => this.cameraStream;

  public getDesktopStream = (): NullableMediaStream => this.desktopStream;

  public getDuration = (): number => {
    return this.duration;
  };

  public getFileSize = (source: RecordingSource): number => {
    try {
      switch (source) {
        case RecordingSource.Camera:
          if (!this.cameraFilePath || !fs.existsSync(this.cameraFilePath)) return 0;
          return fs.statSync(this.cameraFilePath).size;
        case RecordingSource.Desktop:
          if (!this.desktopFilePath || !fs.existsSync(this.desktopFilePath)) return 0;
          return fs.statSync(this.desktopFilePath).size;
        default:
          return 0;
      }
    } catch (e) {
      return 0;
    }
  };

  public setErrorCallback = (callback: RecordingServiceErrorCallback): void => {
    this.recordingErrorCallback = callback;
  };

  private checkAvailableDiskSpace = async () => {
    if (!this.recordingPath) throw new Error(i18n.t<string>('window.recording.error.recordingPathNotSpecified'));

    if (typeof this.recordingPathFreeSpace !== 'number')
      throw new Error(i18n.t<string>('window.recording.error.failedToCheckDiskSpace'));

    if (this.recordingPathFreeSpace < RecordingService.minimumFreeSpace) {
      throw new Error(
        i18n.t<string>('window.recording.error.insufficientDiskSpace', {
          size: filesize(RecordingService.minimumFreeSpace),
        }),
      );
    }
  };

  private initializeStreams = async (): Promise<void> => {
    logger.info(`Initialize streams`);
    const noVideoSources = !this.cameraCaptureSource && !this.desktopCaptureSource;
    const allVideoSourcesDisabled = !this.cameraCaptureEnabled && !this.desktopCaptureEnabled;

    if (noVideoSources || allVideoSourcesDisabled) {
      throw new Error(i18n.t<string>('window.recording.error.noVideoSourcesSelected'));
    }

    if (this.audioCaptureEnabled && !this.audioCaptureSource) {
      throw new Error(i18n.t<string>('window.recording.error.noAudioSource'));
    }

    if (this.cameraCaptureEnabled && !this.cameraCaptureSource) {
      throw new Error(i18n.t<string>('window.recording.error.noCameraSource'));
    }

    if (this.desktopCaptureEnabled && !this.desktopCaptureSource) {
      throw new Error(i18n.t<string>('window.recording.error.noDesktopSource'));
    }

    const audioConstraints: MediaStreamConstraints = {
      audio: { deviceId: this.audioCaptureSource?.deviceId ?? '' },
    };
    try {
      logger.info(`Initializing audio stream`);
      this.audioStream = await navigator.mediaDevices.getUserMedia(audioConstraints);
    } catch (e) {
      if (this.audioCaptureEnabled) {
        throw new Error(i18n.t<string>('window.recording.error.audioSourceInitError'));
      }
    }

    const desktopAudioConstraints: DesktopCaptureConstraints = {
      audio: { mandatory: { chromeMediaSource: 'desktop' } },
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: this.dualCamModeEnabled ? '' : this.desktopCaptureSource?.deviceId ?? '',
        },
      },
    };

    try {
      logger.info(`Initializing desktop audio stream`);
      this.desktopAudioStream = await navigator.mediaDevices.getUserMedia(
        desktopAudioConstraints as MediaStreamConstraints,
      );
    } catch (e) {
      if (this.desktopAudioCaptureEnabled) {
        throw new Error(i18n.t<string>('window.recording.error.desktopAudioSourceInitError'));
      }
    }

    const cameraConstraints: MediaStreamConstraints = {
      audio: false,
      video: { deviceId: this.cameraCaptureSource?.deviceId ?? '', height: this.cameraSourceHeightConstraint },
    };
    if (this.cameraCaptureEnabled) {
      try {
        logger.info(`Initializing camera stream`);
        const { stream, replaceVideoTrack } = await createChangeableStreamCanvas(
          await navigator.mediaDevices.getUserMedia(cameraConstraints),
        );
        this.cameraStreamReplaceFunction = replaceVideoTrack;

        this.cameraStream = stream as MediaStream;
        this.cameraStreamDisconnectAudio = this.appendAudioTracksToStream(
          this.cameraStream,
          this.audioStreamDestinationCamera,
          true,
        );
      } catch (e) {
        throw new Error(i18n.t<string>('window.recording.error.cameraSourceInitError'));
      }
    }

    if (this.desktopCaptureEnabled) {
      const desktopConstraints: DesktopCaptureConstraints | MediaStreamConstraints = { audio: false };

      if (this.dualCamModeEnabled) {
        desktopConstraints.video = {
          deviceId: this.desktopCaptureSource?.deviceId ?? '',
          height: this.cameraSourceHeightConstraint,
        };
      } else {
        (desktopConstraints as DesktopCaptureConstraints).video = {
          mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: this.desktopCaptureSource?.deviceId ?? '' },
        };
      }

      try {
        logger.info(`Initializing desktop stream`);
        const { stream, replaceVideoTrack } = await createChangeableStreamCanvas(
          await navigator.mediaDevices.getUserMedia(desktopConstraints as MediaStreamConstraints),
        );
        this.desktopStreamReplaceFunction = replaceVideoTrack;
        this.desktopStream = stream;
        this.desktopStreamDisconnectAudio = this.appendAudioTracksToStream(
          this.desktopStream,
          this.audioStreamDestinationDesktop,
          true,
        );
      } catch (e) {
        throw new Error(i18n.t<string>('window.recording.error.desktopSourceInitError'));
      }
    }

    if (!this.audioCaptureEnabled) this.muteMicAudio();
    if (!this.cameraDesktopAudioCaptureEnabled || !this.desktopAudioCaptureEnabled) this.muteDesktopAudio();

    navigator.mediaDevices.addEventListener('devicechange', () => {
      if (this.audioCaptureSource) this.changeAudioSource(this.audioCaptureSource);
    });
  };

  public changeAudioSource = async (newSource: CaptureSource) => {
    const audioConstraints = {
      audio: { deviceId: newSource.deviceId ?? '' },
    };
    const isMicrophoneMuted = this.isMicAudioMuted();
    try {
      logger.info(`Initializing audio stream`);
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDeviceAttached = devices.some(
        (d) => d.kind === 'audioinput' && d.deviceId === newSource.deviceId && d.label === newSource.deviceName,
      );
      if (
        this.audioStream?.active &&
        this.audioCaptureDeviceAttached === audioDeviceAttached &&
        newSource === this.audioCaptureSource
      )
        return;
      this.audioCaptureDeviceAttached = audioDeviceAttached;
      this.audioStream?.getTracks().forEach((track) => track.stop());
      this.audioStream = await navigator.mediaDevices.getUserMedia(audioConstraints);
    } catch (e) {
      return;
    }

    if (this.cameraCaptureEnabled && this.cameraStream) {
      this.cameraStreamDisconnectAudio?.();
      this.cameraStreamDisconnectAudio = this.appendAudioTracksToStream(
        this.cameraStream,
        this.audioStreamDestinationCamera,
        true,
      );
    }
    if (this.desktopCaptureEnabled && this.desktopStream) {
      this.desktopStreamDisconnectAudio?.();
      this.desktopStreamDisconnectAudio = this.appendAudioTracksToStream(
        this.desktopStream,
        this.audioStreamDestinationDesktop,
        true,
      );
    }
    this.audioCaptureSource = newSource;
    if (isMicrophoneMuted) this.muteMicAudio();
  };

  private appendAudioTracksToStream = (
    stream: MediaStream,
    audioStreamDestination: MediaStreamAudioDestinationNode,
    includeDesktopAudioTrack: boolean,
  ) => {
    if (!this.audioStream && !includeDesktopAudioTrack) return () => {};

    logger.info(`Append audio tracks to steam`);
    let desktopAudioSource: MediaStreamAudioSourceNode;
    if (includeDesktopAudioTrack && this.desktopAudioStream) {
      const desktopAudioStream = new MediaStream(this.desktopAudioStream.getAudioTracks());
      logger.info(`Create desktop media stream source`);
      desktopAudioSource = this.audioContext.createMediaStreamSource(desktopAudioStream);
      desktopAudioSource.connect(audioStreamDestination);
    }

    let microphoneAudioSource: MediaStreamAudioSourceNode;
    if (this.audioStream) {
      logger.info(`Create audio media stream source`);
      microphoneAudioSource = this.audioContext.createMediaStreamSource(this.audioStream as MediaStream);
      microphoneAudioSource.connect(audioStreamDestination);
    }

    stream.getTracks().forEach((track) => {
      if (track.kind === 'audio') stream.removeTrack(track);
    });
    logger.info(`Add audio tracks to media stream`);
    stream.addTrack(audioStreamDestination.stream.getAudioTracks()[0]);

    return () => {
      desktopAudioSource?.disconnect(audioStreamDestination);
      microphoneAudioSource?.disconnect(audioStreamDestination);
    };
  };

  private handleCameraDataAvailable = async (event: BlobEvent): Promise<void> => {
    if (this.isCanceled || this.cameraDataFlushError || !this.cameraFilePath) return;
    try {
      await RecordingService.appendFile(this.cameraFilePath, event.data);
    } catch (e) {
      this.cameraDataFlushError = true;
      const error = new Error(i18n.t<string>('window.recording.error.errorWritingToFile'));
      this.handleRecorderError(error);
    }
  };

  private handleDesktopDataAvailable = async (event: BlobEvent): Promise<void> => {
    if (this.isCanceled || this.desktopDataFlushError || !this.desktopFilePath) return;
    try {
      await RecordingService.appendFile(this.desktopFilePath, event.data);
    } catch (e) {
      this.desktopDataFlushError = true;
      const error = new Error(i18n.t<string>('window.recording.error.errorWritingToFile'));
      this.handleRecorderError(error);
    }
  };

  private handleCameraRecorderStop = (): void => {
    this.cameraRecorderActive = false;
    if (!this.isCanceled || !this.cameraFilePath) return;
    RecordingService.deleteFile(this.cameraFilePath);
  };

  private handleDesktopRecorderStop = (): void => {
    this.desktopRecorderActive = false;
    if (!this.isCanceled || !this.desktopFilePath) return;
    RecordingService.deleteFile(this.desktopFilePath);
  };

  private handleRecorderError = (error: Error): void => {
    this.stopRecording();
    this.recordingErrorCallback?.(error);
    logger.error(error.message, error);
  };

  private createRecorder = (stream: MediaStream, source: RecordingSource): MediaRecorder => {
    logger.info(`Create recorder, source: ${source}`);
    const recorder = new MediaRecorder(stream, this.recorderOptions);
    // eslint-disable-next-line default-case
    switch (source) {
      case RecordingSource.Camera:
        recorder.ondataavailable = this.handleCameraDataAvailable;
        recorder.onstop = this.handleCameraRecorderStop;
        break;
      case RecordingSource.Desktop:
        recorder.ondataavailable = this.handleDesktopDataAvailable;
        recorder.onstop = this.handleDesktopRecorderStop;
        break;
    }
    recorder.onerror = (event) => {
      let error: Error | undefined;
      if (event) {
        const unknownEvent = event as unknown as { error?: Error; message?: string };
        if (unknownEvent.error) {
          error = unknownEvent.error;
        } else if (unknownEvent.message) {
          error = new Error(unknownEvent.message);
        }
      }
      logger.error(
        'An error was caught during recording.',
        'Source:',
        source,
        'Options:',
        `JSON ${JSON.stringify(this.recorderOptions)}`,
      );
      logger.error('Event:', `JSON ${JSON.stringify(event)}`);
      this.handleRecorderError(error || new Error(`MediaRecorder Error: ${JSON.stringify(event)}`));
    };
    return recorder;
  };

  private replaceStream(
    prevStream: NullableMediaStream,
    audioStreamDestination: MediaStreamAudioDestinationNode,
    newStream: MediaStream,
    replaceVideoTrack?: ReplaceMediaTrackFunction,
  ) {
    if (!prevStream) throw new Error('No stream to replace!');
    const newVideoTrack = newStream.getVideoTracks().at(0);
    const newAudioTrack = newStream.getAudioTracks().at(0);
    if (newAudioTrack) {
      this.cameraStreamDisconnectAudio?.();
      this.cameraStreamDisconnectAudio = this.appendAudioTracksToStream(prevStream, audioStreamDestination, true);
    }
    if (newVideoTrack) replaceVideoTrack?.(newVideoTrack);
  }

  public async replaceCameraSource(newSource: CaptureSource) {
    const cameraConstraints: MediaStreamConstraints = {
      audio: false,
      video: { deviceId: newSource.deviceId, height: this.cameraSourceHeightConstraint },
    };
    const newStream = await navigator.mediaDevices.getUserMedia(cameraConstraints);
    this.replaceStream(
      this.cameraStream,
      this.audioStreamDestinationCamera,
      newStream,
      this.cameraStreamReplaceFunction,
    );
  }

  public async replaceDesktopSource(newSource: CaptureSource) {
    const desktopConstraints: DesktopCaptureConstraints | MediaStreamConstraints = { audio: false };
    if (this.dualCamModeEnabled) {
      desktopConstraints.video = {
        deviceId: newSource.deviceId,
        height: this.cameraSourceHeightConstraint,
      };
    } else {
      (desktopConstraints as DesktopCaptureConstraints).video = {
        mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: newSource.deviceId },
      };
    }
    const newStream = await navigator.mediaDevices.getUserMedia(desktopConstraints);
    this.replaceStream(
      this.desktopStream,
      this.audioStreamDestinationDesktop,
      newStream,
      this.desktopStreamReplaceFunction,
    );
  }

  private initializeCameraRecorder = (): void => {
    if (!this.cameraStream) return;
    this.cameraRecorder = this.createRecorder(this.cameraStream, RecordingSource.Camera);
  };

  private initializeDesktopRecorder = (): void => {
    if (!this.desktopStream) return;
    this.desktopRecorder = this.createRecorder(this.desktopStream, RecordingSource.Desktop);
  };

  private initializeRecorders = (): void => {
    this.initializeCameraRecorder();
    this.initializeDesktopRecorder();
  };
}
