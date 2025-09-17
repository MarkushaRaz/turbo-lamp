import { all, fork } from 'redux-saga/effects';
import { sharedSaga } from '_shared/sagas';
import { mainSaga } from './main-saga';

export function* combinedSaga() {
  yield all([fork(mainSaga), fork(sharedSaga)]);
}
