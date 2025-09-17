import { ipcRenderer } from 'electron';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { duration } from 'moment';
import { Window } from '_renderer/components';
import { useBeforeUnload, useEntitlement, useWindowTransparency } from '_renderer/hooks';
import log from 'electron-log';
import {
  deleteEntryAction,
  getAvailableCameraCaptureSourcesAction,
  getAvailableDesktopCaptureSources,
  getRecordingEntryAction,
  getRecordingPathFreeSpaceAction,
  minimizeWindowAction,
  recallPtzCameraPresetAction,
  resetRecordingStateAction,
  setAudioCaptureSourceAction,
  setCameraCaptureSourceAction,
  setDesktopCaptureSourceAction,
  setEntryWindowStateAction,
  setRecordingStatusAction,
  showErrorBoxAction,
  switchToWindowAction,
  updateRecordingEntryAction,
} from '_shared/actions';
import {
  Entitlement,
  EntryStatus,
  EntryWindowMode,
  RecordingSource,
  RecordingStatus,
  UploadStatus,
  WindowRoute,
} from '_shared/enums';
import { CaptureSource, RecordingData } from '_shared/types';
import { IS_WINDOWS } from '_shared/constants';
import {
  CancelButton,
  CancelConfirmDialog,
  CommunicationPanel,
  ControlsPanel,
  Countdown,
  HideWindowButton,
  MuteDesktopAudioButton,
  MuteMicrophoneAudioButton,
  MutedMicrophoneNotification,
  PauseButton,
  PreviewButton,
  PreviewsPannel,
  PtzCameraPresetControls,
  RecordingDuration,
  SourcePreview,
  StatusIndicator,
  StopButton,
  WarmupProgress,
  SourceSelector,
  AudioSourceSelectionPanel,
} from './components';
import { RecordingService } from './services';
import { recordingWindowStateSelector } from './state';
import { useStyles } from './styles';
import { RecordingServiceFilePaths } from './types';

const logger = log.scope('RecordingWindow');

const autoHidePreviewTimeout = duration(5, 'seconds').asMilliseconds();
const missedThreshold = duration(5, 'seconds').asMilliseconds();
const maxRecordingDuration = duration(3, 'hours').asMilliseconds();
const warmupDuration = duration(3, 'seconds').asMilliseconds();
const warmupProgressUpdateFrequency = 50;

let recordingService: RecordingService | null;

export const RecordingWindow: FunctionComponent = () => {
  useWindowTransparency();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    audioBitrate,
    audioCaptureEnabled,
    audioCaptureSource,
    availableCameraCaptureSources,
    availableDesktopCaptureSources,
    cameraCaptureEnabled,
    cameraCaptureSource,
    cameraDesktopAudioCaptureEnabled,
    desktopAudioCaptureEnabled,
    desktopCaptureEnabled,
    desktopCaptureSource,
    dualCamModeEnabled,
    entry,
    mirrorCamera,
    ptzCameraControlsEnabled,
    ptzCameraDefaultPresetIndex,
    recordingPath,
    recordingPathFreeSpace,
    resetPtzCameraPreset,
    scheduleEnabled,
    status,
    videoBitrate,
    videoCodec,
    videoResolution,
  } = useSelector(recordingWindowStateSelector);

  const [recorderInitialized, setRecorderInitialized] = useState(false);
  const [entryInitialized, setEntryInitialized] = useState(false);
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [previewAutoHidden, setPreviewAutoHidden] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [freeSpaceInitialized, setFreeSpaceInitialized] = useState(false);
  const [warmingUp, setWarmingUp] = useState(false);
  const [warmupProgress, setWarmupProgress] = useState(0);
  const [warmupRemainingTime, setWarmupRemainingTime] = useState(warmupDuration);
  const [isMicrophoneMuted, setMicrophoneMuted] = useState(!audioCaptureEnabled);
  const [isDesktopAudioMuted, setDesktopAudioMuted] = useState(
    !desktopAudioCaptureEnabled && !cameraDesktopAudioCaptureEnabled,
  );
  const [audioSelectorOpen, setAudioSelectorOpen] = useState(false);
  const [cancelConfirmDialogOpen, setCancelConfirmDialogOpen] = useState(false);

  const canCancelRecording = useEntitlement(Entitlement.CanCancelRecording);
  const canMuteAudio = useEntitlement(Entitlement.CanMuteAudio);
  const canCaptureWindows = useEntitlement(Entitlement.CanCaptureWindows);
  const canHotSwapCaptureSources = useEntitlement(Entitlement.CanHotSwapCaptureSources);
  const hasSystemAudioToggle = useEntitlement(Entitlement.HasSystemAudioToggle);

  const initialized = entryInitialized && recorderInitialized;
  const showCameraPreview = initialized && previewEnabled && cameraCaptureEnabled;
  const showCameraSourceSelector = canHotSwapCaptureSources;
  const showDesktopPreview = initialized && previewEnabled && desktopCaptureEnabled;
  const showDesktopSourceSelector = canHotSwapCaptureSources || canCaptureWindows;
  const showAudioSourceSelector = canHotSwapCaptureSources;
  const isRecording = status === RecordingStatus.Started || status === RecordingStatus.Paused;
  const isPaused = status === RecordingStatus.Paused;
  const showCountdown = scheduleEnabled && entry && entry.isFromSchedule;

  const handleRecordingError = useCallback(
    (error: Error) => {
      logger.error(error.message, error);
      dispatch(setRecordingStatusAction(RecordingStatus.Failed));

      if (entry) {
        const recordings: RecordingData[] = entry.recordings.map((data) => ({
          ...data,
          recordingStatus: RecordingStatus.Failed,
        }));

        dispatch(updateRecordingEntryAction({ ...entry, recordings, status: EntryStatus.Failed }));
      }

      dispatch(showErrorBoxAction(t('window.recording.error.recordingError'), error.message));
      dispatch(switchToWindowAction(WindowRoute.MainWindow));
    },
    [dispatch, entry, t],
  );

  const pauseRecording = useCallback(
    () => {
      if (status === RecordingStatus.Paused) {
        recordingService?.resumeRecording();
        dispatch(setRecordingStatusAction(RecordingStatus.Started));
        logger.info(`Recording is ${status}`);
      } else {
        recordingService?.pauseRecording();
        dispatch(setRecordingStatusAction(RecordingStatus.Paused));
        logger.info(`Recording is ${status}`);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entry, status],
  );

  const stopAndSaveRecording = useCallback(
    () =>
      recordingService?.stopRecording().then(() => {
        logger.info(`Stop recording`);
        dispatch(setRecordingStatusAction(RecordingStatus.Finished));

        if (entry) {
          const scheduled = scheduleEnabled && entry.isFromSchedule;

          const recordings = entry.recordings.map((recordingData) => ({
            ...recordingData,
            recordingStatus: RecordingStatus.Finished,
            uploadStatus: scheduled ? UploadStatus.ReadyToUpload : UploadStatus.UnavailableForUpload,
            size: recordingService?.getFileSize(recordingData.source) ?? 0,
          }));

          const totalSize = recordings.reduce<number>(
            (previousValue, currentValue) => previousValue + currentValue.size,
            0,
          );

          if (!totalSize) {
            const emptyRecordingError = new Error(t<string>('window.recording.error.emptyRecording'));
            logger.error(emptyRecordingError.message, emptyRecordingError);
            handleRecordingError(emptyRecordingError);
            return;
          }

          const entryData = {
            ...entry,
            duration: recordingService?.getDuration() ?? 0,
            endTime: new Date(),
            recordings,
            size: totalSize,
            status: scheduled ? EntryStatus.ReadyToUpload : EntryStatus.Recorded,
          };

          dispatch(updateRecordingEntryAction(entryData));

          if (scheduled) {
            dispatch(switchToWindowAction(WindowRoute.MainWindow));
          } else {
            dispatch(setEntryWindowStateAction(entryData, EntryWindowMode.Edit));
            dispatch(switchToWindowAction(WindowRoute.EntryWindow));
          }
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, entry],
  );

  const handleMissedRecording = useCallback(() => {
    logger.info(`Cancel recording`);
    logger.info(`Set entry canceled status`);
    dispatch(setRecordingStatusAction(RecordingStatus.Canceled));

    if (entry) {
      logger.info(`Set recordings canceled status`);
      const recordings: RecordingData[] = entry.recordings.map((data) => ({
        ...data,
        recordingStatus: RecordingStatus.Canceled,
      }));

      logger.info(`Update recording entry`);
      dispatch(updateRecordingEntryAction({ ...entry, recordings, status: EntryStatus.Missed }));
    }

    logger.info(`Go to main window`);
    dispatch(switchToWindowAction(WindowRoute.MainWindow));
  }, [dispatch, entry]);

  const startRecording = useCallback(() => {
    if (!entry) return;
    logger.info(`Trying to start recording`);

    const scheduled = scheduleEnabled && entry.isFromSchedule;

    let stopIn = maxRecordingDuration;

    if (scheduled && entry.endTime) {
      logger.info(`Entry is scheduled`);
      const now = new Date();
      stopIn = entry.endTime.valueOf() - now.valueOf();

      if (stopIn <= missedThreshold) {
        handleMissedRecording();
        return;
      }
    }

    if (stopIn) {
      logger.info(`Scheduled recording will stop after ${stopIn} ms`);
      setTimeout(stopAndSaveRecording, stopIn);
    }

    const recordingPaths: RecordingServiceFilePaths = {};

    recordingPaths.cameraFilePath = entry.recordings.filter(
      (data) => data.source === RecordingSource.Camera,
    )[0]?.filePath;

    recordingPaths.desktopFilePath = entry.recordings.filter(
      (data) => data.source === RecordingSource.Desktop,
    )[0]?.filePath;

    logger.info(`Recording paths: ${JSON.stringify(recordingPath)}`);

    logger.info(`Starting recordings`);
    recordingService?.startRecording(recordingPaths);
    dispatch(setRecordingStatusAction(RecordingStatus.Started));

    logger.info(`Set recordings started status`);
    const recordings: RecordingData[] = entry.recordings.map((data) => ({
      ...data,
      recordingStatus: RecordingStatus.Started,
    }));

    logger.info(`Update recording entries`);
    dispatch(updateRecordingEntryAction({ ...entry, recordings, status: EntryStatus.Recording }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, entry]);

  const cancelRecording = useCallback(() => {
    recordingService
      ?.cancelRecording()
      .then(() => {
        logger.info(`Cancel recording`);
        dispatch(setRecordingStatusAction(RecordingStatus.Canceled));
        if (entry) dispatch(deleteEntryAction(entry.id, entry.isFromSchedule));
        dispatch(switchToWindowAction(WindowRoute.MainWindow));
      })
      .finally(() => {});
  }, [dispatch, entry]);

  useEffect(() => {
    dispatch(resetRecordingStateAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!freeSpaceInitialized && recordingPathFreeSpace === undefined) {
      dispatch(getRecordingPathFreeSpaceAction(recordingPath));
      setFreeSpaceInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordingPathFreeSpace]);

  useEffect(() => {
    if (!recorderInitialized && freeSpaceInitialized && recordingPathFreeSpace !== undefined) {
      recordingService = new RecordingService({
        enabledCaptures: {
          audioCaptureEnabled,
          cameraCaptureEnabled,
          desktopAudioCaptureEnabled,
          desktopCaptureEnabled,
          cameraDesktopAudioCaptureEnabled,
        },
        captureSources: {
          audioCaptureSource,
          cameraCaptureSource,
          desktopCaptureSource,
        },
        cameraSourceHeightConstraint: { ideal: videoResolution },
        dualCamModeEnabled,
        recorderOptions: {
          audioBitsPerSecond: audioBitrate,
          videoBitsPerSecond: videoBitrate,
          mimeType: videoCodec,
        },
        recordingPath,
        recordingPathFreeSpace,
      });

      recordingService
        .initialize()
        .then(() => {
          logger.info(`Recorder initialized`);
          setRecorderInitialized(true);
          setMicrophoneMuted(recordingService?.isMicAudioMuted() ?? true);
          setDesktopAudioMuted(recordingService?.isDesktopAudioMuted() ?? true);
          dispatch(getRecordingEntryAction(cameraCaptureEnabled, desktopCaptureEnabled));
        })
        .catch((error: Error) => {
          logger.error(error.message, error);
          dispatch(showErrorBoxAction(t('window.recording.error.initError'), error.message));
          dispatch(switchToWindowAction(WindowRoute.MainWindow));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freeSpaceInitialized, recordingPathFreeSpace]);

  useEffect(() => {
    if (recorderInitialized) {
      recordingService?.setErrorCallback(handleRecordingError);
    }
  }, [recorderInitialized, handleRecordingError]);

  useEffect(() => {
    if (entry && !entryInitialized) {
      logger.info(`Entry initialized`);
      setEntryInitialized(true);
    }
  }, [entry, entryInitialized]);

  useEffect(() => {
    if (entryInitialized && recorderInitialized && status === RecordingStatus.Pending) {
      setWarmingUp(true);
    }
  }, [entryInitialized, recorderInitialized, status]);

  useEffect(() => {
    setWarmupProgress(Math.round((Math.abs(warmupRemainingTime - warmupDuration) / warmupDuration) * 100));

    if (!warmingUp) return;

    if (warmupRemainingTime === 0) {
      logger.info('Warmup time finished');
      if (status === RecordingStatus.Pending) startRecording();
      setWarmingUp(false);
      return;
    }

    let remainingTime = warmupRemainingTime - warmupProgressUpdateFrequency;
    if (remainingTime < 0) remainingTime = 0;

    setTimeout(() => setWarmupRemainingTime(remainingTime), warmupProgressUpdateFrequency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warmingUp, warmupRemainingTime]);

  useEffect(() => {
    if (!isRecording || previewAutoHidden) return () => {};

    const timeout = setTimeout(() => {
      logger.info(`Hide preview window`);
      setPreviewEnabled(false);
      setPreviewAutoHidden(true);
    }, autoHidePreviewTimeout);

    return () => {
      clearTimeout(timeout);
    };
  }, [isRecording, previewAutoHidden]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!showCountdown) {
      logger.info(`Show countdown`);
      interval = setInterval(() => {
        setRecordingDuration(recordingService?.getDuration() ?? 0);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [showCountdown]);

  const togglePreview = () => {
    logger.info(`Show preview: ${!previewEnabled}`);
    setPreviewEnabled(!previewEnabled);
  };

  const hideWindow = () => {
    logger.info('Hide recording window');
    dispatch(minimizeWindowAction());
  };

  const handleRecallCameraPreset = (presetIndex: number) => {
    logger.info('Recall camera preset');
    ipcRenderer.send('camera-preset-changed', { preset: presetIndex });
    dispatch(recallPtzCameraPresetAction(presetIndex));
  };

  useBeforeUnload(() => {
    if (status === RecordingStatus.Started || status === RecordingStatus.Paused) cancelRecording();
    recordingService = null;
    if (ptzCameraControlsEnabled && resetPtzCameraPreset) {
      handleRecallCameraPreset(ptzCameraDefaultPresetIndex);
    }
  });

  useEffect(() => {
    const handler = (_ipcEvent: unknown, message: { event: string; data: object }) => {
      if (!isRecording) return;
      switch (message.event) {
        case 'pause-recording':
          pauseRecording();
          break;
        case 'stop-recording':
          stopAndSaveRecording();
          break;
        case 'cancel-recording':
          cancelRecording();
          break;
        default:
      }
    };
    ipcRenderer.addListener('stream-deck', handler);
    return () => {
      ipcRenderer.removeListener('stream-deck', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pauseRecording, stopAndSaveRecording, cancelRecording]);

  const toggleMuteMicrophone = () => {
    if (isMicrophoneMuted) {
      recordingService?.unmuteMicAudio();
    } else {
      recordingService?.muteMicAudio();
    }
    setMicrophoneMuted(recordingService?.isMicAudioMuted() ?? true);
  };

  const toggleMuteDesktopAudio = () => {
    if (isDesktopAudioMuted) {
      recordingService?.unmuteDesktopAudio();
    } else {
      recordingService?.muteDesktopAudio();
    }
    setDesktopAudioMuted(recordingService?.isDesktopAudioMuted() ?? true);
  };

  const handleCameraSourceChange = (source?: CaptureSource) => {
    if (source && recordingService) {
      recordingService?.replaceCameraSource(source);
      dispatch(setCameraCaptureSourceAction(source));
    }
  };

  const handleDesktopSourceChange = (source?: CaptureSource) => {
    if (source && recordingService) {
      recordingService?.replaceDesktopSource(source);
      dispatch(setDesktopCaptureSourceAction(source));
    }
  };

  const handleAudioSourceChange = (source?: CaptureSource) => {
    if (source) {
      recordingService?.changeAudioSource(source);
      dispatch(setAudioCaptureSourceAction(source));
    }
  };

  const getCameraCaptureSources = () => {
    dispatch(getAvailableCameraCaptureSourcesAction(cameraCaptureSource));
  };

  const getDesktopCaptureSources = () => {
    if (dualCamModeEnabled) {
      dispatch(getAvailableCameraCaptureSourcesAction(desktopCaptureSource, RecordingSource.Desktop));
    } else {
      dispatch(getAvailableDesktopCaptureSources(desktopCaptureSource));
    }
  };

  return (
    <Window className={classes.window} frameProps={{ classes: { root: classes.windowFrame } }}>
      {previewEnabled && initialized && !cancelConfirmDialogOpen && (
        <PreviewsPannel>
          {showCameraPreview && (
            <>
              <SourcePreview stream={recordingService?.getCameraStream()} mirrored={mirrorCamera}>
                {ptzCameraControlsEnabled && <PtzCameraPresetControls onPresetRecall={handleRecallCameraPreset} />}
              </SourcePreview>
              {showCameraSourceSelector && (
                <SourceSelector
                  onChangeSelectedSource={handleCameraSourceChange}
                  onOpen={getCameraCaptureSources}
                  sources={availableCameraCaptureSources}
                  selectedSource={cameraCaptureSource}
                />
              )}
            </>
          )}
          {showDesktopPreview && (
            <>
              <SourcePreview
                stream={recordingService?.getDesktopStream()}
                mirrored={dualCamModeEnabled && mirrorCamera}
              />
              {showDesktopSourceSelector && (
                <SourceSelector
                  onChangeSelectedSource={handleDesktopSourceChange}
                  onOpen={getDesktopCaptureSources}
                  sources={dualCamModeEnabled ? availableCameraCaptureSources : availableDesktopCaptureSources}
                  selectedSource={desktopCaptureSource}
                />
              )}
            </>
          )}
        </PreviewsPannel>
      )}
      {cancelConfirmDialogOpen && (
        <CancelConfirmDialog
          onClose={() => setCancelConfirmDialogOpen(false)}
          onConfirm={cancelRecording}
          isScheduledRecording={entry?.isFromSchedule}
        />
      )}
      <CommunicationPanel roundTopCorners={(!previewEnabled || !initialized) && !cancelConfirmDialogOpen} />
      {initialized && (
        <MutedMicrophoneNotification
          source={audioCaptureSource}
          muted={isMicrophoneMuted}
          roundTopCorners={!previewEnabled}
        />
      )}
      {showAudioSourceSelector && audioSelectorOpen && (
        <AudioSourceSelectionPanel
          onChangeSelectedSource={handleAudioSourceChange}
          selectedSource={audioCaptureSource}
        />
      )}
      <ControlsPanel>
        {warmingUp && <WarmupProgress progress={warmupProgress} />}
        <StatusIndicator enabled={isRecording} isPaused={isPaused} />
        {showCountdown && entry.endTime ? (
          <Countdown active={isRecording} stopTime={entry.endTime} />
        ) : (
          <RecordingDuration active={isRecording} duration={recordingDuration} />
        )}
        {canCancelRecording && <CancelButton onClick={() => setCancelConfirmDialogOpen(true)} />}
        <PauseButton enabled={isRecording} isPaused={isPaused} onClick={pauseRecording} />
        <StopButton enabled={isRecording} onClick={stopAndSaveRecording} />
        {canMuteAudio && (
          <>
            <MuteMicrophoneAudioButton
              enabled={!!audioCaptureSource && initialized}
              isMuted={isMicrophoneMuted}
              onClick={toggleMuteMicrophone}
              selectorState={showAudioSourceSelector ? audioSelectorOpen : undefined}
              onClickSelector={() => setAudioSelectorOpen(!audioSelectorOpen)}
            />
            {IS_WINDOWS && hasSystemAudioToggle && (
              <MuteDesktopAudioButton
                enabled={!!desktopCaptureSource && initialized}
                isMuted={isDesktopAudioMuted}
                onClick={toggleMuteDesktopAudio}
              />
            )}
          </>
        )}
        <PreviewButton enabled={initialized} previewEnabled={previewEnabled} onClick={togglePreview} />
        <HideWindowButton onClick={hideWindow} />
      </ControlsPanel>
    </Window>
  );
};
