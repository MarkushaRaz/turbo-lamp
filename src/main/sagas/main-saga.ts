/* eslint import/no-cycle:off */
import { all, fork } from 'redux-saga/effects';
import { appSaga } from '_main/sagas/app-saga';
import { audioProcessorSaga } from '_main/sagas/audio-processor-saga';
import { captureSourcesSaga } from '_main/sagas/capture-sources-saga';
import { entrySaga } from '_main/sagas/entry-saga';
import { librarySaga } from '_main/sagas/library-saga';
import { licenseSaga } from '_main/sagas/license-saga';
import { ptzCameraSaga } from '_main/sagas/ptz-camera-saga';
import { recordingSaga } from '_main/sagas/recording-saga';
import { settingsSaga } from '_main/sagas/settings-saga';
import { windowSaga } from '_main/sagas/window-saga';

export function* mainSaga() {
  yield all([
    fork(appSaga),
    fork(audioProcessorSaga),
    fork(captureSourcesSaga),
    fork(entrySaga),
    fork(librarySaga),
    fork(licenseSaga),
    fork(ptzCameraSaga),
    fork(recordingSaga),
    fork(settingsSaga),
    fork(windowSaga),
  ]);
}
