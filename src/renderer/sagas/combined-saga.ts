import { all, fork } from 'redux-saga/effects';
import { sharedSaga } from '_shared/sagas';
import { rendererSaga } from './renderer-saga';

export function* combinedSaga() {
  yield all([fork(rendererSaga), fork(sharedSaga)]);
}
