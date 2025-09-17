import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Window } from '_renderer/components';
import { useEntitlement, useWindowTransparency } from '_renderer/hooks';
import log from 'electron-log';
import {
  AudioSourceSelector,
  CameraSourceSelector,
  DesktopAudioToggle,
  DesktopSourceSelector,
  ManageButton,
  RecordButton,
  ScheduleEnabledIcon,
  Separator,
  SourceSelectorsPanel,
  WindowFrame,
} from '_renderer/windows/MainWindow/components';
import {
  getAvailableAudioCaptureSourcesAction,
  getAvailableCameraCaptureSourcesAction,
  getAvailableDesktopCaptureSources,
  hideWindowAction,
  minimizeWindowAction,
  setAudioCaptureSourceAction,
  setCameraCaptureSourceAction,
  setDesktopCaptureSourceAction,
  switchToWindowAction,
  toggleAudioCaptureSourceAction,
  toggleCameraCaptureSourceAction,
  toggleCameraDesktopAudioCaptureEnabledAction,
  toggleDesktopAudioCaptureEnabledAction,
  toggleDesktopCaptureSourceAction,
} from '_shared/actions';
import { IS_WINDOWS } from '_shared/constants';
import { Entitlement, RecordingSource, WindowRoute } from '_shared/enums';
import { CaptureSource } from '_/shared/types';
import { mainWindowStateSelector } from './state';

const logger = log.scope('MainWindow');

export const MainWindow: FunctionComponent = () => {
  useWindowTransparency();
  const dispatch = useDispatch();
  const hasSystemAudioToggle = useEntitlement(Entitlement.HasSystemAudioToggle);

  const {
    availableDesktopCaptureSources,
    availableAudioCaptureSources,
    availableCameraCaptureSources,
    audioCaptureSource,
    cameraCaptureSource,
    desktopCaptureSource,
    cameraCaptureEnabled,
    cameraDesktopAudioCaptureEnabled,
    audioCaptureEnabled,
    desktopCaptureEnabled,
    desktopAudioCaptureEnabled,
    connectionSettingsMissing,
    scheduleEnabled,
    dualCamModeEnabled,
    mirrorCamera,
  } = useSelector(mainWindowStateSelector);

  useEffect(() => {
    logger.info(`Get available audio capture sources`);
    dispatch(getAvailableAudioCaptureSourcesAction(audioCaptureSource));
    if (!audioCaptureSource) {
      dispatch(toggleAudioCaptureSourceAction(false));
    }
  }, [audioCaptureSource, dispatch]);

  useEffect(() => {
    logger.info(`Get available camera capture sources`);
    dispatch(getAvailableCameraCaptureSourcesAction(cameraCaptureSource, RecordingSource.Camera));
    if (!cameraCaptureSource) {
      logger.info(`Disable camera capture, cause: ${!cameraCaptureSource}`);
      dispatch(toggleCameraCaptureSourceAction(false));
    }
  }, [cameraCaptureSource, dispatch]);

  useEffect(() => {
    if (dualCamModeEnabled) {
      logger.info(`Get available dual camera capture sources`);
      dispatch(getAvailableCameraCaptureSourcesAction(desktopCaptureSource, RecordingSource.Desktop));
    } else {
      logger.info(`Get available desktop capture sources`);
      dispatch(getAvailableDesktopCaptureSources(desktopCaptureSource));
    }
    if (!desktopCaptureSource) {
      logger.info(`Disable desktop capture, cause: ${!desktopCaptureSource}`);
      dispatch(toggleDesktopCaptureSourceAction(false));
    }
  }, [desktopCaptureSource, dualCamModeEnabled, dispatch]);

  useEffect(() => {
    if (dualCamModeEnabled) {
      logger.info(`Disable desktop audio capture, cause: ${dualCamModeEnabled}`);
      dispatch(toggleCameraDesktopAudioCaptureEnabledAction(false));
      dispatch(toggleDesktopAudioCaptureEnabledAction(false));
    }
  }, [dispatch, dualCamModeEnabled]);

  const getAudioCaptureSources = () => {
    logger.info(`Get audio capture source: ${audioCaptureSource?.deviceName}`);
    dispatch(getAvailableAudioCaptureSourcesAction(audioCaptureSource));
  };

  const getCameraCaptureSources = () => {
    logger.info(`Get camera capture source: ${cameraCaptureSource?.deviceName}`);
    dispatch(getAvailableCameraCaptureSourcesAction(cameraCaptureSource));
  };

  const getDesktopCaptureSources = () => {
    logger.info(`Get desktop capture source: ${desktopCaptureSource?.deviceName}`);
    if (dualCamModeEnabled) {
      dispatch(getAvailableCameraCaptureSourcesAction(desktopCaptureSource, RecordingSource.Desktop));
    } else {
      dispatch(getAvailableDesktopCaptureSources(desktopCaptureSource));
    }
  };

  const setAudioCaptureSource = (source?: CaptureSource) => {
    logger.info(`Set audio capture source: ${source?.deviceName}`);
    dispatch(setAudioCaptureSourceAction(source));
  };

  const setCameraCaptureSource = (source?: CaptureSource) => {
    logger.info(`Set camera capture source: ${source?.deviceName}`);
    dispatch(setCameraCaptureSourceAction(source));
  };

  const setDesktopCaptureSource = (source?: CaptureSource) => {
    logger.info(`Set desktop capture source: ${source?.deviceName}`);
    dispatch(setDesktopCaptureSourceAction(source));
  };

  const toggleAudioCaptureStatus = () => {
    logger.info(`Audio captured enabled: ${!audioCaptureEnabled}`);
    dispatch(toggleAudioCaptureSourceAction(!audioCaptureEnabled));
  };

  const toggleCameraCaptureStatus = () => {
    logger.info(`Camera captured enabled: ${!cameraCaptureEnabled}`);
    dispatch(toggleCameraCaptureSourceAction(!cameraCaptureEnabled));
  };

  const toggleDesktopCaptureStatus = () => {
    logger.info(`Desktop captured enabled: ${!desktopCaptureEnabled}`);
    dispatch(toggleDesktopCaptureSourceAction(!desktopCaptureEnabled));
  };

  const toggleDesktopAudioCaptureStatus = () => {
    logger.info(`Desktop audio captured enabled: ${!desktopAudioCaptureEnabled}`);
    dispatch(toggleDesktopAudioCaptureEnabledAction(!desktopAudioCaptureEnabled));
  };

  const toggleCameraDesktopAudioCaptureStatus = () => {
    logger.info(`Camera desktop audio captured enabled: ${!cameraDesktopAudioCaptureEnabled}`);
    dispatch(toggleCameraDesktopAudioCaptureEnabledAction(!cameraDesktopAudioCaptureEnabled));
  };

  const toggleDesktopAudioCaptureStatuses = () => {
    toggleDesktopAudioCaptureStatus();
    toggleCameraDesktopAudioCaptureStatus();
  };

  const switchToRecordingWindow = () => {
    logger.info(`Switch to recording window`);
    dispatch(switchToWindowAction(WindowRoute.RecordingWindow));
  };

  const switchToDashboardWindow = () => {
    logger.info(`Switch to dashboard window`);
    dispatch(switchToWindowAction(WindowRoute.DashboardWindow));
  };

  const handleClose = () => {
    logger.info(`Close main window`);
    dispatch(hideWindowAction());
  };

  const handleMinimize = () => {
    logger.info(`Minimize main window`);
    dispatch(minimizeWindowAction());
  };

  const recordingEnabled =
    ((cameraCaptureEnabled && !!cameraCaptureSource) || (desktopCaptureEnabled && !!desktopCaptureSource)) &&
    (!audioCaptureEnabled || (audioCaptureEnabled && !!audioCaptureSource));

  const DesktopSourceSelectorComponent = dualCamModeEnabled ? CameraSourceSelector : DesktopSourceSelector;

  return (
    <Window
      customFrameComponent={WindowFrame}
      controlsProps={{
        onCloseClick: handleClose,
        onMinimizeClick: handleMinimize,
        size: 'small',
      }}
      showControls
    >
      {scheduleEnabled ? (
        <ScheduleEnabledIcon />
      ) : (
        <RecordButton enabled={recordingEnabled} onClick={switchToRecordingWindow} />
      )}
      <Separator />
      <SourceSelectorsPanel>
        <DesktopSourceSelectorComponent
          desktopAudioCaptureEnabled={desktopAudioCaptureEnabled}
          enabled={!scheduleEnabled}
          mirrored={dualCamModeEnabled && mirrorCamera}
          onChangeSelectedSource={setDesktopCaptureSource}
          onToggleDesktopAudioCaptureStatus={toggleDesktopAudioCaptureStatuses}
          onToggleDropdown={getDesktopCaptureSources}
          onToggleSourceStatus={toggleDesktopCaptureStatus}
          selectedSource={desktopCaptureSource}
          showDesktopAudioCaptureCheckbox={IS_WINDOWS && !dualCamModeEnabled && !hasSystemAudioToggle}
          sourceEnabled={desktopCaptureEnabled}
          sources={dualCamModeEnabled ? availableCameraCaptureSources : availableDesktopCaptureSources}
        />
        <CameraSourceSelector
          desktopAudioCaptureEnabled={cameraDesktopAudioCaptureEnabled}
          enabled={!scheduleEnabled}
          mirrored={mirrorCamera}
          onChangeSelectedSource={setCameraCaptureSource}
          onToggleDropdown={getCameraCaptureSources}
          onToggleSourceStatus={toggleCameraCaptureStatus}
          selectedSource={cameraCaptureSource}
          sourceEnabled={cameraCaptureEnabled}
          sources={availableCameraCaptureSources}
        />
        <AudioSourceSelector
          enabled={!scheduleEnabled}
          sourceEnabled={audioCaptureEnabled}
          onChangeSelectedSource={setAudioCaptureSource}
          onToggleDropdown={getAudioCaptureSources}
          onToggleSourceStatus={toggleAudioCaptureStatus}
          selectedSource={audioCaptureSource}
          sources={availableAudioCaptureSources}
        />
        {IS_WINDOWS && hasSystemAudioToggle && (
          <DesktopAudioToggle
            enabled={!scheduleEnabled && IS_WINDOWS && !dualCamModeEnabled}
            sourceEnabled={desktopAudioCaptureEnabled && cameraDesktopAudioCaptureEnabled}
            onChange={toggleDesktopAudioCaptureStatuses}
            selectedSource={desktopCaptureSource}
          />
        )}
      </SourceSelectorsPanel>
      <Separator />
      <ManageButton onClick={switchToDashboardWindow} showWarning={connectionSettingsMissing} />
    </Window>
  );
};
