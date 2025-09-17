import { all, fork, takeLatest } from 'redux-saga/effects';
import { windowManager } from '_main/window-manager';
import { WINDOW_ACTION_HIDE, WINDOW_ACTION_MINIMIZE, WINDOW_ACTION_SHOW } from '_shared/constants';

function hideWindow() {
  windowManager.getCurrentWindow()?.hide();
}

function* watchHideWindow() {
  yield takeLatest(WINDOW_ACTION_HIDE, hideWindow);
}

function minimizeWindow() {
  windowManager.getCurrentWindow()?.minimize();
}

function* watchMinimizeWindow() {
  yield takeLatest(WINDOW_ACTION_MINIMIZE, minimizeWindow);
}

function showWindow() {
  windowManager.getCurrentWindow()?.show();
}

function* watchShowWindow() {
  yield takeLatest(WINDOW_ACTION_SHOW, showWindow);
}

export function* windowSaga() {
  yield all([fork(watchHideWindow), fork(watchMinimizeWindow), fork(watchShowWindow)]);
}
