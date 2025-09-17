import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { AlertDialog, Grid, GridSpacer, PasswordDialog } from '_renderer/components';
import { createStructuredSelector } from 'reselect';
import { CombinedState, SettingsState } from '_shared/types';
import {
  makeSelectConnectionSettingsMissing,
  makeSelectIsVideoCapturePossible,
  makeSelectSettingsState,
} from '_shared/selectors';
import { useSelector } from 'react-redux';
import log from 'electron-log';
import { EXPERT_PASSWORD } from '_shared/constants';
import {
  AudioBitrate,
  AudioProcessorType,
  BridgeMode,
  Entitlement,
  VideoBitrate,
  VideoCodec,
  VideoResolution,
} from '_/shared/enums';
import { useEntitlement } from '_renderer/hooks';
import {
  AudioBitrateSelectField,
  AudioProcessorControlsEnabledCheckbox,
  AudioProcessorIpField,
  AudioProcessorTypeSelectField,
  AuthenticationEnabledCheckbox,
  AutostartBroadcastsEnabledCheckbox,
  BridgeModeSelectField,
  BroadcastsKeyField,
  BroadcastsServerField,
  CameraEnabledCheckbox,
  CommunicationBridgeUrlField,
  ContentProtectionDisabledCheckbox,
  DaysToKeepDataField,
  DeleteAfterUploadCheckbox,
  DualCamModeEnabledCheckbox,
  MicrophoneEnabledCheckbox,
  MirrorCameraCheckbox,
  MoodleEnabledCheckbox,
  MoodleTokenField,
  MoodleUrlField,
  NoScheduleTokenWarningText,
  NoVideoSourceWarningText,
  PresenceControlCheckbox,
  PtzCameraControlsEnabledCheckbox,
  PtzCameraDefaultPresetIndexSelectField,
  PtzCameraIpField,
  ReactivateScheduleCheckbox,
  RecordingPathField,
  ResetButton,
  ResetPtzCameraPresetCheckbox,
  SakaiEnabledCheckbox,
  SakaiLoginField,
  SakaiPasswordField,
  SakaiUrlField,
  SaveButton,
  ScheduleCommunicationCheckbox,
  ScheduleEnabledCheckbox,
  ScheduleRoomNumber,
  ScheduleUrlField,
  ServicePartnerIdField,
  ServicePartnerSecretField,
  ServiceTokenIdField,
  ServiceTokenSecretField,
  ServiceUrlField,
  SettingsAccordion,
  SettingsAccordionDetails,
  SettingsAccordionSummary,
  ShowExpertSettingsSwitch,
  VideoBitrateSelectField,
  VideoCodecSelectField,
} from '../../components';
import { useSettingsForm } from './hooks';
import { VideoResolutionSelectField } from '../../components/VideoResolutionSelectField';

const logger = log.scope('Settings');

interface Selection {
  connectionSettingsMissing: boolean;
  isVideoCapturePossible: boolean;
  settings: SettingsState;
}

const stateSelector = createStructuredSelector<CombinedState, Selection>({
  connectionSettingsMissing: makeSelectConnectionSettingsMissing(),
  isVideoCapturePossible: makeSelectIsVideoCapturePossible(),
  settings: makeSelectSettingsState(),
});

export const Settings: FunctionComponent = () => {
  const { connectionSettingsMissing, isVideoCapturePossible, settings: initialSettings } = useSelector(stateSelector);

  const canRecordOnSchedule = useEntitlement(Entitlement.CanRecordOnSchedule);
  const canUseMeetConferencing = useEntitlement(Entitlement.CanUseMeetConferencing);
  const canUseMeetBroadcasting = useEntitlement(Entitlement.CanUseMeetBroadcasting);
  const hasExpertSettings = useEntitlement(Entitlement.HasExpertSettings);
  const canUseMeet = canUseMeetConferencing || canUseMeetBroadcasting;
  const canEnableSchedule = initialSettings.scheduleToken && isVideoCapturePossible && canRecordOnSchedule;

  const { settings, isDirty, isValid, isSaving, validationErrors, handleSettingsChange, resetForm, saveSettings } =
    useSettingsForm(initialSettings);

  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogContent, setAlertDialogContent] = useState('');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [expertPasswordInvalid, setExpertPasswordInvalid] = useState(false);
  const [showExpertSettings, setShowExpertSettings] = useState(false);

  const openAlertDialog = (content: string) => {
    logger.info(`Open alert dialog. Content: ${content}`);
    setAlertDialogContent(content);
    setAlertDialogOpen(true);
  };

  const closeAlertDialog = () => {
    logger.info('Close alert dialog');
    setAlertDialogOpen(false);
    setAlertDialogContent('');
  };

  const openPasswordDialog = () => {
    logger.info('Open password dialog');
    setPasswordDialogOpen(true);
  };

  const closePasswordDialog = () => {
    logger.info('Close password dialog');
    setPasswordDialogOpen(false);
  };

  const handlePasswordSubmit = (password: string) => {
    if (password === EXPERT_PASSWORD) {
      logger.info('Password is valid. Show expert settings.');
      setExpertPasswordInvalid(false);
      setShowExpertSettings(true);
      setPasswordDialogOpen(false);
    } else {
      logger.info('Password is invalid! No access.');
      setExpertPasswordInvalid(true);
    }
  };

  const handleShowExpertSettingsChange = () => {
    if (showExpertSettings) {
      logger.info('Close expert settings');
      setShowExpertSettings(false);
      return;
    }
    openPasswordDialog();
  };

  const handleAccordionChange = (panel: string) => (_event: ChangeEvent<unknown>, isExpanded: boolean) => {
    logger.info(`${isExpanded ? 'Open' : 'Close'} panel: ${panel}`);
    setExpanded(isExpanded ? panel : false);
  };

  const handleSave = async () => {
    logger.info('Attempting to save settings');
    const result = await saveSettings();
    if (!result.success && result.error) {
      openAlertDialog(result.error);
    }
  };

  const { t } = useTranslation();

  return (
    <>
      <Helmet title={t<string>('window.dashboard.settings.windowTitle')} />
      <Grid container direction='column' item grow={1} scrollY padded>
        {showExpertSettings && (
          <SettingsAccordion
            expanded={expanded === 'connectionSettings'}
            onChange={handleAccordionChange('connectionSettings')}
          >
            <SettingsAccordionSummary
              aria-controls='connectionSettings-content'
              error={connectionSettingsMissing}
              id='connectionSettings-header'
            >
              {t('window.dashboard.settings.group.connectionSettings.title')}
            </SettingsAccordionSummary>
            <SettingsAccordionDetails>
              <ServiceUrlField
                error={validationErrors.serviceUrl}
                value={settings.serviceUrl}
                onValueChange={(value) => handleSettingsChange({ serviceUrl: value })}
              />
              <ServicePartnerIdField
                error={validationErrors.servicePartnerId}
                value={settings.servicePartnerId}
                onValueChange={(value) => handleSettingsChange({ servicePartnerId: Number(value) })}
              />
              {(!settings.serviceTokenId || !settings.serviceTokenSecret) && (
                <ServicePartnerSecretField
                  error={validationErrors.servicePartnerSecret}
                  value={settings.servicePartnerSecret}
                  onValueChange={(value) => handleSettingsChange({ servicePartnerSecret: value })}
                />
              )}
              {!settings.servicePartnerSecret && (
                <>
                  <ServiceTokenIdField
                    error={validationErrors.serviceTokenId}
                    value={settings.serviceTokenId}
                    onValueChange={(value) => handleSettingsChange({ serviceTokenId: value })}
                  />
                  <ServiceTokenSecretField
                    error={validationErrors.serviceTokenSecret}
                    value={settings.serviceTokenSecret}
                    onValueChange={(value) => handleSettingsChange({ serviceTokenSecret: value })}
                  />
                </>
              )}
            </SettingsAccordionDetails>
          </SettingsAccordion>
        )}
        {canRecordOnSchedule && (
          <SettingsAccordion
            expanded={expanded === 'scheduleSettings'}
            onChange={handleAccordionChange('scheduleSettings')}
          >
            <SettingsAccordionSummary aria-controls='scheduleSettings-content' id='scheduleSettings-header'>
              {t('window.dashboard.settings.group.scheduleSettings.title')}
            </SettingsAccordionSummary>
            <SettingsAccordionDetails>
              {!settings.scheduleToken && <NoScheduleTokenWarningText />}
              {!isVideoCapturePossible && <NoVideoSourceWarningText />}
              <ScheduleEnabledCheckbox
                checked={settings.scheduleEnabled}
                disabled={!canEnableSchedule}
                onValueChange={(value) => handleSettingsChange({ scheduleEnabled: value })}
              />
              <ReactivateScheduleCheckbox
                checked={settings.reactivateSchedule}
                disabled={!canEnableSchedule}
                onValueChange={(value) => handleSettingsChange({ reactivateSchedule: value })}
              />
              {showExpertSettings && (
                <ScheduleUrlField
                  disabled={!settings.scheduleEnabled && !settings.scheduleCommunicationEnabled}
                  error={validationErrors.scheduleUrl}
                  required={settings.scheduleEnabled && settings.scheduleCommunicationEnabled}
                  value={settings.scheduleUrl}
                  onValueChange={(value) => handleSettingsChange({ scheduleUrl: value })}
                />
              )}
              <ScheduleRoomNumber
                disabled={!settings.scheduleEnabled && !settings.scheduleCommunicationEnabled}
                error={validationErrors.scheduleRoomNumber}
                required={settings.scheduleEnabled && settings.scheduleCommunicationEnabled}
                value={settings.scheduleRoomNumber}
                onValueChange={(value) => handleSettingsChange({ scheduleRoomNumber: value })}
              />
            </SettingsAccordionDetails>
          </SettingsAccordion>
        )}
        {canRecordOnSchedule && canUseMeet && (
          <SettingsAccordion
            expanded={expanded === 'communicationSettings'}
            onChange={handleAccordionChange('communicationSettings')}
          >
            <SettingsAccordionSummary aria-controls='communicationSettings-content' id='communicationSettings-header'>
              {t('window.dashboard.settings.group.communicationSettings.title')}
            </SettingsAccordionSummary>
            <SettingsAccordionDetails>
              <ScheduleCommunicationCheckbox
                checked={settings.scheduleCommunicationEnabled}
                disabled={!settings.scheduleToken}
                onValueChange={(value) => handleSettingsChange({ scheduleCommunicationEnabled: value })}
              />
              {showExpertSettings && (
                <CommunicationBridgeUrlField
                  disabled={!settings.scheduleCommunicationEnabled}
                  error={validationErrors.communicationBridgeUrl}
                  value={settings.communicationBridgeUrl}
                  onValueChange={(value) => handleSettingsChange({ communicationBridgeUrl: value })}
                />
              )}
              {showExpertSettings && (
                <BridgeModeSelectField
                  disabled={!settings.scheduleCommunicationEnabled}
                  value={settings.bridgeMode}
                  onValueChange={(value: BridgeMode) => handleSettingsChange({ bridgeMode: value })}
                />
              )}
              <PresenceControlCheckbox
                disabled={!settings.scheduleCommunicationEnabled}
                checked={settings.presenceControlEnabled}
                onValueChange={(value) => handleSettingsChange({ presenceControlEnabled: value })}
              />
              <AuthenticationEnabledCheckbox
                disabled={!settings.scheduleCommunicationEnabled}
                checked={settings.communicationAuthenticationEnabled}
                onValueChange={(value) => handleSettingsChange({ communicationAuthenticationEnabled: value })}
              />
              <MicrophoneEnabledCheckbox
                disabled={!settings.scheduleCommunicationEnabled}
                checked={settings.communicationMicrophoneEnabled}
                onValueChange={(value) => handleSettingsChange({ communicationMicrophoneEnabled: value })}
              />
              <CameraEnabledCheckbox
                disabled={!settings.scheduleCommunicationEnabled}
                checked={settings.communicationCameraEnabled}
                onValueChange={(value) => handleSettingsChange({ communicationCameraEnabled: value })}
              />
              <AutostartBroadcastsEnabledCheckbox
                disabled={!settings.scheduleCommunicationEnabled}
                checked={settings.autostartBroadcastsEnabled}
                onValueChange={(value) => handleSettingsChange({ autostartBroadcastsEnabled: value })}
              />
              <BroadcastsServerField
                disabled={!settings.scheduleCommunicationEnabled || !settings.autostartBroadcastsEnabled}
                value={settings.broadcastsServer}
                onValueChange={(value) => handleSettingsChange({ broadcastsServer: value })}
              />
              <BroadcastsKeyField
                disabled={!settings.scheduleCommunicationEnabled || !settings.autostartBroadcastsEnabled}
                value={settings.broadcastsKey}
                onValueChange={(value) => handleSettingsChange({ broadcastsKey: value })}
              />
            </SettingsAccordionDetails>
          </SettingsAccordion>
        )}
        <SettingsAccordion
          expanded={expanded === 'recordingSettings'}
          onChange={handleAccordionChange('recordingSettings')}
        >
          <SettingsAccordionSummary aria-controls='recordingSettings-content' id='recordingSettings-header'>
            {t('window.dashboard.settings.group.recordingSettings.title')}
          </SettingsAccordionSummary>
          <SettingsAccordionDetails>
            {showExpertSettings && (
              <ContentProtectionDisabledCheckbox
                checked={settings.contentProtectionDisabled}
                onValueChange={(value: boolean) => handleSettingsChange({ contentProtectionDisabled: value })}
              />
            )}
            <MirrorCameraCheckbox
              checked={settings.mirrorCamera}
              onValueChange={(value: boolean) => handleSettingsChange({ mirrorCamera: value })}
            />
            <DualCamModeEnabledCheckbox
              checked={settings.dualCamModeEnabled}
              onValueChange={(value: boolean) => handleSettingsChange({ dualCamModeEnabled: value })}
            />
            <DaysToKeepDataField
              error={validationErrors.daysToKeepData}
              value={settings.daysToKeepData}
              disabled={settings.deleteAfterUpload}
              onValueChange={(value) => handleSettingsChange({ daysToKeepData: Number(value) })}
            />
            <DeleteAfterUploadCheckbox
              checked={settings.deleteAfterUpload}
              onValueChange={(value: boolean) => handleSettingsChange({ deleteAfterUpload: value })}
            />
            <RecordingPathField
              error={validationErrors.recordingPath}
              inputProps={{ readOnly: true }}
              value={settings.recordingPath}
              onValueChange={(value) => handleSettingsChange({ recordingPath: value })}
            />
            {showExpertSettings && (
              <>
                <VideoCodecSelectField
                  value={settings.videoCodec}
                  onValueChange={(value: VideoCodec) => handleSettingsChange({ videoCodec: value })}
                />
                <VideoBitrateSelectField
                  value={settings.videoBitrate}
                  onValueChange={(value: VideoBitrate) => handleSettingsChange({ videoBitrate: value })}
                />
                <AudioBitrateSelectField
                  value={settings.audioBitrate}
                  onValueChange={(value: AudioBitrate) => handleSettingsChange({ audioBitrate: value })}
                />
                <VideoResolutionSelectField
                  value={settings.videoResolution}
                  onValueChange={(value: VideoResolution) => handleSettingsChange({ videoResolution: value })}
                />
              </>
            )}
          </SettingsAccordionDetails>
        </SettingsAccordion>
        {showExpertSettings && (
          <SettingsAccordion
            expanded={expanded === 'moodleSettings'}
            onChange={handleAccordionChange('moodleSettings')}
          >
            <SettingsAccordionSummary aria-controls='moodleSettings-content' id='moodleSettings-header'>
              {t('window.dashboard.settings.group.moodleSettings.title')}
            </SettingsAccordionSummary>
            <SettingsAccordionDetails>
              <MoodleEnabledCheckbox
                checked={settings.moodleEnabled}
                onValueChange={(value) => handleSettingsChange({ moodleEnabled: value })}
              />
              <MoodleUrlField
                disabled={!settings.moodleEnabled}
                error={validationErrors.moodleUrl}
                required={settings.moodleEnabled}
                value={settings.moodleUrl}
                onValueChange={(value) => handleSettingsChange({ moodleUrl: value })}
              />
              <MoodleTokenField
                disabled={!settings.moodleEnabled}
                error={validationErrors.moodleToken}
                required={settings.moodleEnabled}
                value={settings.moodleToken}
                onValueChange={(value) => handleSettingsChange({ moodleToken: value })}
              />
            </SettingsAccordionDetails>
          </SettingsAccordion>
        )}
        {showExpertSettings && (
          <SettingsAccordion expanded={expanded === 'sakaiSettings'} onChange={handleAccordionChange('sakaiSettings')}>
            <SettingsAccordionSummary aria-controls='sakaiSettings-content' id='sakaiSettings-header'>
              {t('window.dashboard.settings.group.sakaiSettings.title')}
            </SettingsAccordionSummary>
            <SettingsAccordionDetails>
              <SakaiEnabledCheckbox
                checked={settings.sakaiEnabled}
                onValueChange={(value) => handleSettingsChange({ sakaiEnabled: value })}
              />
              <SakaiUrlField
                disabled={!settings.sakaiEnabled}
                error={validationErrors.sakaiUrl}
                required={settings.sakaiEnabled}
                value={settings.sakaiUrl}
                onValueChange={(value) => handleSettingsChange({ sakaiUrl: value })}
              />
              <SakaiLoginField
                disabled={!settings.sakaiEnabled}
                error={validationErrors.sakaiLogin}
                required={settings.sakaiEnabled}
                value={settings.sakaiLogin}
                onValueChange={(value) => handleSettingsChange({ sakaiLogin: value })}
              />
              <SakaiPasswordField
                disabled={!settings.sakaiEnabled}
                error={validationErrors.sakaiPassword}
                required={settings.sakaiEnabled}
                value={settings.sakaiPassword}
                onValueChange={(value) => handleSettingsChange({ sakaiPassword: value })}
              />
            </SettingsAccordionDetails>
          </SettingsAccordion>
        )}
        {showExpertSettings && (
          <SettingsAccordion
            expanded={expanded === 'ptzCameraSettings'}
            onChange={handleAccordionChange('ptzCameraSettings')}
          >
            <SettingsAccordionSummary aria-controls='ptzCameraSettings-content' id='ptzCameraSettings-header'>
              {t('window.dashboard.settings.group.ptzCameraSettings.title')}
            </SettingsAccordionSummary>
            <SettingsAccordionDetails>
              <PtzCameraControlsEnabledCheckbox
                checked={settings.ptzCameraControlsEnabled}
                onValueChange={(value) => handleSettingsChange({ ptzCameraControlsEnabled: value })}
              />
              <PtzCameraIpField
                disabled={!settings.ptzCameraControlsEnabled}
                error={validationErrors.ptzCameraIp}
                required={settings.ptzCameraControlsEnabled}
                value={settings.ptzCameraIp}
                onValueChange={(value) => handleSettingsChange({ ptzCameraIp: value })}
              />
              <ResetPtzCameraPresetCheckbox
                checked={settings.resetPtzCameraPreset}
                disabled={!settings.ptzCameraControlsEnabled}
                onValueChange={(value) => handleSettingsChange({ resetPtzCameraPreset: value })}
              />
              <PtzCameraDefaultPresetIndexSelectField
                disabled={!settings.ptzCameraControlsEnabled || !settings.resetPtzCameraPreset}
                value={settings.ptzCameraDefaultPresetIndex}
                onValueChange={(value: number) => handleSettingsChange({ ptzCameraDefaultPresetIndex: value })}
              />
            </SettingsAccordionDetails>
          </SettingsAccordion>
        )}
        {showExpertSettings && (
          <SettingsAccordion
            expanded={expanded === 'audioProcessorSettings'}
            onChange={handleAccordionChange('audioProcessorSettings')}
          >
            <SettingsAccordionSummary aria-controls='audioProcessorSettings-content' id='audioProcessorSettings-header'>
              {t('window.dashboard.settings.group.audioProcessorSettings.title')}
            </SettingsAccordionSummary>
            <SettingsAccordionDetails>
              <AudioProcessorControlsEnabledCheckbox
                checked={settings.audioProcessorControlsEnabled}
                onValueChange={(value) => handleSettingsChange({ audioProcessorControlsEnabled: value })}
              />
              <AudioProcessorIpField
                disabled={!settings.audioProcessorControlsEnabled}
                error={validationErrors.audioProcessorIp}
                required={settings.audioProcessorControlsEnabled}
                value={settings.audioProcessorIp}
                onValueChange={(value) => handleSettingsChange({ audioProcessorIp: value })}
              />
              <AudioProcessorTypeSelectField
                disabled={!settings.audioProcessorControlsEnabled}
                value={settings.audioProcessorType}
                onValueChange={(value: AudioProcessorType) => handleSettingsChange({ audioProcessorType: value })}
              />
            </SettingsAccordionDetails>
          </SettingsAccordion>
        )}
      </Grid>
      <GridSpacer horizontalBorders />
      <Grid container direction='row' justifyContent='space-between' item basis={65} padded shrink={0}>
        <ResetButton disabled={!isDirty} onClick={resetForm} />
        {hasExpertSettings && (
          <ShowExpertSettingsSwitch checked={showExpertSettings} onChange={handleShowExpertSettingsChange} />
        )}
        <SaveButton disabled={!isDirty || !isValid || isSaving} loading={isSaving} onClick={handleSave} />
      </Grid>
      <AlertDialog
        onClose={closeAlertDialog}
        open={alertDialogOpen}
        content={alertDialogContent}
        title={t<string>('general.error')}
      />
      <PasswordDialog
        onClose={closePasswordDialog}
        onSubmit={handlePasswordSubmit}
        open={passwordDialogOpen}
        text={t<string>('window.dashboard.settings.passwordDialog.text')}
        passwordInvalid={expertPasswordInvalid}
      />
    </>
  );
};
