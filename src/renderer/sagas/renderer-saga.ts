import { all, fork } from 'redux-saga/effects';
import { captureSourcesSaga } from '_renderer/sagas/capture-sources-saga';

export function* rendererSaga() {
  yield all([fork(captureSourcesSaga)]);
}
