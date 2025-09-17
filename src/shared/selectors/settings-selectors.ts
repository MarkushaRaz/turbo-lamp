import { createSelector } from 'reselect';
import { CombinedState, SettingsState } from '_shared/types';
import { settingsState } from '_shared/states';
import { CombinedStateKey } from '_shared/enums';

const selectSettingsDomain = (state: CombinedState): SettingsState => state[CombinedStateKey.Settings] || settingsState;

export const makeSelectSettingsState = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate);

export const makeSelectSettingServicePartnerId = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.servicePartnerId);

export const makeSelectSettingServiceTokenId = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.serviceTokenId);

export const makeSelectSettingServiceTokenSecret = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.serviceTokenSecret);

export const makeSelectSettingServiceUrl = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.serviceUrl);

export const makeSelectSettingScheduleEnabled = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.scheduleEnabled);

export const makeSelectSettingScheduleToken = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.scheduleToken);

export const makeSelectSettingScheduleUrl = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.scheduleUrl);

export const makeSelectSettingScheduleRoomNumber = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.scheduleRoomNumber);

export const makeSelectSettingDaysToKeepData = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.daysToKeepData);

export const makeSelectSettingDeleteAfterUpload = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.deleteAfterUpload);

export const makeSelectSettingDualCamModeEnabled = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.dualCamModeEnabled);

export const makeSelectSettingContentProtectionDisabled = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.contentProtectionDisabled);

export const makeSelectSettingAudioBitrate = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.audioBitrate);

export const makeSelectSettingVideoBitrate = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.videoBitrate);

export const makeSelectSettingVideoCodec = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.videoCodec);

export const makeSelectSettingVideoResolution = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.videoResolution);

export const makeSelectSettingReactivateSchedule = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.reactivateSchedule);

export const makeSelectSettingRecordingPath = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.recordingPath);

export const makeSelectSettingPtzCameraControlsEnabled = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.ptzCameraControlsEnabled);

export const makeSelectSettingPtzCameraIp = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.ptzCameraIp);

export const makeSelectSettingMoodleEnabled = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.moodleEnabled);

export const makeSelectSettingMoodleToken = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.moodleToken);

export const makeSelectSettingMoodleUrl = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.moodleUrl);

export const makeSelectSettingSakaiEnabled = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.sakaiEnabled);

export const makeSelectSettingSakaiLogin = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.sakaiLogin);

export const makeSelectSettingSakaiPassword = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.sakaiPassword);

export const makeSelectSettingSakaiUrl = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.sakaiUrl);

export const makeSelectSettingMirrorCamera = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.mirrorCamera);

export const makeSelectConnectionSettingsMissing = () =>
  createSelector(
    selectSettingsDomain,
    (substate: SettingsState) =>
      !substate.servicePartnerId || !substate.serviceTokenId || !substate.serviceTokenSecret || !substate.serviceUrl,
  );

export const makeSelectSettingResetPtzCameraPreset = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.resetPtzCameraPreset);

export const makeSelectSettingPtzCameraDefaultPresetIndex = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.ptzCameraDefaultPresetIndex);

export const makeSelectSettingAudioProcessorIp = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.audioProcessorIp);

export const makeSelectSettingAudioProcessorType = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.audioProcessorType);

export const makeSelectSettingAudioProcessorControlsEnabled = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.audioProcessorControlsEnabled);

export const makeSelectCommunicationBridgeUrl = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.communicationBridgeUrl);

export const makeSelectCommunicationBridgeToken = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.communicationBridgeToken);

export const makeSelectSettingAllowUntrustedSSL = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.allowUntrustedSSL);

export const makeSelectSettingKalturaTrustedCA = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.kalturaTrustedCA);

export const makeSelectSettingMeetTrustedCA = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.meetTrustedCA);

export const makeSelectSettingMoodleTrustedCA = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.moodleTrustedCA);

export const makeSelectSettingSakaiTrustedCA = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.sakaiTrustedCA);

export const makeSelectSettingScheduleTrustedCA = () =>
  createSelector(selectSettingsDomain, (substate: SettingsState) => substate.scheduleTrustedCA);

export default selectSettingsDomain;
