import { app, dialog } from 'electron';
import { all, call, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/lib/constants';
import { DEFAULT_RECORDING_PATH } from '_main/constants';
import { windowManager } from '_main/window-manager';
import { resetRecordingStateAction, setEntryWindowStateAction, setRecordingPathSettingAction } from '_shared/actions';
import {
  APP_ACTION_QUIT_APP,
  APP_ACTION_SHOW_ERROR_BOX,
  APP_ACTION_SWITCH_TO_ENTRY_WINDOW,
  APP_ACTION_SWITCH_TO_WINDOW,
} from '_shared/constants';
import { ProcessEnvKey, WindowRoute } from '_shared/enums';
import {
  makeSelectCommunicationBridgeToken,
  makeSelectCommunicationBridgeUrl,
  makeSelectSettingAllowUntrustedSSL,
  makeSelectSettingMeetTrustedCA,
  makeSelectSettingRecordingPath,
  makeSelectSettingScheduleRoomNumber,
  makeSelectSettingScheduleToken,
  makeSelectSettingScheduleTrustedCA,
  makeSelectSettingScheduleUrl,
} from '_shared/selectors';
import { ShowErrorBoxAction, SwitchToEntryWindowAction, SwitchToWindowAction } from '_shared/types';
import { RecordingWindow } from '_main/windows';
import log from 'electron-log';

const logger = log.scope('AppSaga');

function quitApp() {
  logger.info(`Quiting the app`);
  app.quit();
}

function* watchQuitAppAction() {
  yield takeLatest(APP_ACTION_QUIT_APP, quitApp);
}

function showErrorBox({ payload: { title, content } }: ShowErrorBoxAction) {
  logger.debug(`Show error box. ${title}`);
  dialog.showErrorBox(title, content);
}

function* watchShowErrorBox() {
  yield takeEvery(APP_ACTION_SHOW_ERROR_BOX, showErrorBox);
}

function* switchToEntryWindow({ payload: { entry, mode } }: SwitchToEntryWindowAction) {
  logger.debug(`Switch to entry window. For entry #${entry.id}`);
  yield put(setEntryWindowStateAction(entry, mode));
  yield call(windowManager.load, WindowRoute.EntryWindow);
}

function* watchSwitchToEntryWindow() {
  yield takeEvery(APP_ACTION_SWITCH_TO_ENTRY_WINDOW, switchToEntryWindow);
}

function* switchToWindow({ payload: { route, hidden } }: SwitchToWindowAction) {
  logger.debug(`Switch to ${route}`);
  const previousWindowName = windowManager.getCurrentWindow()?.className;
  yield call(windowManager.load, route, hidden);
  if (previousWindowName === RecordingWindow.name) yield put(resetRecordingStateAction());
}

function* watchSwitchToWindow() {
  yield takeEvery(APP_ACTION_SWITCH_TO_WINDOW, switchToWindow);
}

function* setStoreDefaults() {
  logger.debug(`Set store default values`);
  const recordingPath: string = yield select(makeSelectSettingRecordingPath());

  if (!recordingPath) {
    yield put(setRecordingPathSettingAction(DEFAULT_RECORDING_PATH));
  }
}

function* provideScheduleSettings() {
  process.env[ProcessEnvKey.SCHEDULE_TOKEN] = yield select(makeSelectSettingScheduleToken());
  process.env[ProcessEnvKey.SCHEDULE_URL] = yield select(makeSelectSettingScheduleUrl());
  process.env[ProcessEnvKey.SCHEDULE_ROOM_NUMBER] = yield select(makeSelectSettingScheduleRoomNumber());
  process.env[ProcessEnvKey.SCHEDULE_TRUSTED_CA] = yield select(makeSelectSettingScheduleTrustedCA());
}

function* provideCommunicationSettings() {
  process.env[ProcessEnvKey.COMMUNICATION_BRIDGE_URL] = yield select(makeSelectCommunicationBridgeUrl());
  process.env[ProcessEnvKey.COMMUNICATION_BRIDGE_TOKEN] = yield select(makeSelectCommunicationBridgeToken());
  process.env[ProcessEnvKey.MEET_TRUSTED_CA] = yield select(makeSelectSettingMeetTrustedCA());
}

function* rehydrateSaga() {
  logger.debug(`Rehydrate saga`);
  yield setStoreDefaults();
  yield provideScheduleSettings();
  yield provideCommunicationSettings();
  const allowUntrustedSSL: boolean = yield select(makeSelectSettingAllowUntrustedSSL());
  process.env[ProcessEnvKey.ALLOW_UNTRUSTED_SSL] = String(allowUntrustedSSL);
}

function* watchStoreRehydrate() {
  yield takeEvery(REHYDRATE, rehydrateSaga);
}

export function* appSaga() {
  logger.info(`Initialize app saga`);
  yield all([
    fork(watchQuitAppAction),
    fork(watchShowErrorBox),
    fork(watchSwitchToEntryWindow),
    fork(watchSwitchToWindow),
    fork(watchStoreRehydrate),
  ]);
}
