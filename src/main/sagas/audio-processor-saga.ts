import * as dgram from 'dgram';
import log from 'electron-log';
import { all, fork, select, takeLatest } from 'redux-saga/effects';
import { AUDIO_PROCESSOR_ACTION_RECALL_PRESET } from '_shared/constants';
import { RecallAudioProcessorPresetAction } from '_shared/types';
import {
  makeSelectSettingAudioProcessorIp,
  makeSelectSettingAudioProcessorControlsEnabled,
  makeSelectSettingAudioProcessorType,
} from '_shared/selectors';
import { AudioProcessorType } from '_shared/enums';
import { Tesira } from '_main/services';

const logger = log.scope('AudioSaga');

function* recallAudioProcessorPreset({ payload: { presetIndex } }: RecallAudioProcessorPresetAction) {
  const controlIsEnabled: boolean = yield select(makeSelectSettingAudioProcessorControlsEnabled());
  if (!controlIsEnabled) return;
  logger.debug(`Recall audio processor preset`);

  const endpoint: string = yield select(makeSelectSettingAudioProcessorIp());
  if (!endpoint || presetIndex < 1) return;
  logger.debug(`Audio processor found`);

  const type: AudioProcessorType = yield select(makeSelectSettingAudioProcessorType());

  let selectedPort = type === AudioProcessorType.Tesira ? 23 : 5557;
  const [host, port] = endpoint.split(':', 2);
  if (!host) return;
  if (port) selectedPort = Number(port);

  if (type === AudioProcessorType.Tesira) {
    Tesira.getTesira(host, selectedPort)
      .recallPreset(presetIndex)
      .catch((error) => logger.error(error));
  } else {
    const client = dgram.createSocket('udp4');
    const recallCommand = `SET,0,PRESET,ID,0,0,${presetIndex}.\r\n`;
    const message = Buffer.from(recallCommand, 'ascii');

    client.send(message, 0, message.length, selectedPort, host, (error) => {
      if (error) logger.error(error.message, error);
      client.close();
    });
  }
}

function* watchRecallAudioProcessorPreset() {
  yield takeLatest(AUDIO_PROCESSOR_ACTION_RECALL_PRESET, recallAudioProcessorPreset);
}

export function* audioProcessorSaga() {
  yield all([fork(watchRecallAudioProcessorPreset)]);
}
