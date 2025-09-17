import { all, fork, takeLatest } from 'redux-saga/effects';
import { SETTINGS_ACTION_SET_MULTIPLE } from '_shared/constants';
import { KalturaClientManager } from '_main/services/kaltura-upload-service/KalturaClientManager';
import { ProcessEnvKey } from '_shared/enums';
import { SetMultipleSettingsAction } from '_shared/types';

function handleSetMultipleSettings({
  payload: {
    settings: {
      allowUntrustedSSL,
      communicationBridgeToken,
      communicationBridgeUrl,
      meetTrustedCA,
      scheduleRoomNumber,
      scheduleToken,
      scheduleTrustedCA,
      scheduleUrl,
    },
  },
}: SetMultipleSettingsAction) {
  // noinspection JSIgnoredPromiseFromCall
  KalturaClientManager.init();

  if (
    typeof allowUntrustedSSL === 'boolean' &&
    String(allowUntrustedSSL) !== process.env[ProcessEnvKey.ALLOW_UNTRUSTED_SSL]
  ) {
    process.env[ProcessEnvKey.ALLOW_UNTRUSTED_SSL] = String(allowUntrustedSSL);
  }

  if (scheduleUrl && scheduleUrl !== process.env[ProcessEnvKey.SCHEDULE_URL]) {
    process.env[ProcessEnvKey.SCHEDULE_URL] = scheduleUrl;
  }

  if (scheduleTrustedCA !== undefined && scheduleTrustedCA !== process.env[ProcessEnvKey.SCHEDULE_TRUSTED_CA]) {
    process.env[ProcessEnvKey.SCHEDULE_TRUSTED_CA] = scheduleTrustedCA;
  }

  if (scheduleToken && scheduleToken !== process.env[ProcessEnvKey.SCHEDULE_TOKEN]) {
    process.env[ProcessEnvKey.SCHEDULE_TOKEN] = scheduleToken;
  }

  if (scheduleRoomNumber && scheduleRoomNumber !== process.env[ProcessEnvKey.SCHEDULE_ROOM_NUMBER]) {
    process.env[ProcessEnvKey.SCHEDULE_ROOM_NUMBER] = scheduleRoomNumber;
  }

  if (communicationBridgeUrl && communicationBridgeUrl !== process.env[ProcessEnvKey.COMMUNICATION_BRIDGE_URL]) {
    process.env[ProcessEnvKey.COMMUNICATION_BRIDGE_URL] = communicationBridgeUrl;
  }

  if (meetTrustedCA !== undefined && meetTrustedCA !== process.env[ProcessEnvKey.MEET_TRUSTED_CA]) {
    process.env[ProcessEnvKey.MEET_TRUSTED_CA] = meetTrustedCA;
  }

  if (communicationBridgeToken && communicationBridgeToken !== process.env[ProcessEnvKey.COMMUNICATION_BRIDGE_TOKEN]) {
    process.env[ProcessEnvKey.COMMUNICATION_BRIDGE_TOKEN] = communicationBridgeToken;
  }
}

function* watchSetMultipleSettings() {
  yield takeLatest(SETTINGS_ACTION_SET_MULTIPLE, handleSetMultipleSettings);
}

export function* settingsSaga() {
  yield all([fork(watchSetMultipleSettings)]);
}
