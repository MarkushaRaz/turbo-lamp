import * as dgram from 'dgram';
import log from 'electron-log';
import { all, fork, select, takeLatest } from 'redux-saga/effects';
import { PTZ_CAMERA_ACTION_RECALL_PRESET } from '_shared/constants';
import { RecallPtzCameraPresetAction } from '_shared/types';
import { makeSelectSettingPtzCameraIp } from '_shared/selectors';

const logger = log.scope('PTZSaga');

function* recallPtzCameraPreset({ payload: { presetIndex } }: RecallPtzCameraPresetAction) {
  const cameraIp: string = yield select(makeSelectSettingPtzCameraIp());
  if (!cameraIp || presetIndex < 0) return;

  const client = dgram.createSocket('udp4');
  // noinspection JSDeprecatedSymbols
  const presetHex = (presetIndex + 0x10000).toString(16).substr(-2);
  const recallCommand = `010000070000000b8101043f02${presetHex}ff`;
  const message = Buffer.from(recallCommand, 'hex');

  client.send(message, 0, message.length, 52381, cameraIp, (error) => {
    if (error) logger.error(error.message, error);
    client.close();
  });
}

function* watchRecallPtzCameraPreset() {
  yield takeLatest(PTZ_CAMERA_ACTION_RECALL_PRESET, recallPtzCameraPreset);
}

export function* ptzCameraSaga() {
  yield all([fork(watchRecallPtzCameraPreset)]);
}
