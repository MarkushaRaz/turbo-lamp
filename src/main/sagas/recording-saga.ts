import { getDiskSpaceInfo } from 'aktru-recorder-native';
import log from 'electron-log';
import i18n from 'i18next';
import moment from 'moment';
import { all, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { FindOneOptions } from 'typeorm';
import { DEFAULT_WINDOW_ICON, RECORDING_WINDOW_ICON } from '_main/constants';
import { MoreThanDate } from '_main/database';
import { Entry, Recording } from '_main/database/entities';
import { entryRepository, recordingRepository } from '_main/database/repositories';
import { TrayIcon } from '_main/enums';
import { windowManager } from '_main/window-manager';
import { setMultipleSettingsAction, setRecordingEntryAction, setRecordingPathFreeSpaceAction } from '_shared/actions';
import {
  RECORDING_ACTION_GET_RECORDING_ENTRY,
  RECORDING_ACTION_GET_RECORDING_PATH_FREE_SPACE,
  RECORDING_ACTION_SET_RECORDING_STATUS,
  RECORDING_ACTION_UPDATE_RECORDING_ENTRY,
} from '_shared/constants';
import { Entitlement, EntryStatus, RecordingSource, RecordingStatus } from '_shared/enums';
import {
  makeSelectCanEnableSchedule,
  makeSelectSettingReactivateSchedule,
  makeSelectSettingScheduleEnabled,
} from '_shared/selectors';
import { ScheduleService } from '_shared/services';
import {
  GetRecordingEntryAction,
  GetRecordingPathFreeSpaceAction,
  SetRecordingStatusAction,
  UpdateRecordingEntryAction,
} from '_shared/types';
import { asError } from '_shared/utils';
import { hasEntitlement } from '_main/utils';
import { setTrayIcon } from '../tray';

const logger = log.scope('RecordingSaga');

// TODO: Handle exceptions
function* getRecordingEntry({ payload: { cameraCaptureEnabled, desktopCaptureEnabled } }: GetRecordingEntryAction) {
  const recordings: Array<Recording> = [];

  try {
    if (cameraCaptureEnabled) {
      const recording = recordingRepository.createRecording(RecordingSource.Camera);
      yield recordingRepository.save(recording);
      recordings.push(recording);
    }

    if (desktopCaptureEnabled) {
      const recording = recordingRepository.createRecording(RecordingSource.Desktop);
      yield recordingRepository.save(recording);
      recordings.push(recording);
    }

    const findOptions: FindOneOptions<Entry> = {
      where: {
        status: EntryStatus.Pending,
        endTime: MoreThanDate(moment()),
      },
      order: {
        startTime: 'ASC',
      },
    };

    let entry: Entry = yield entryRepository.findOne(findOptions);

    if (entry) {
      entry.recordings = recordings;
    }

    if (!entry) {
      const name = `${i18n.t('general.newEntry')} - ${moment().format('YYYY.MM.DD HH:mm:ss')}`;
      entry = new Entry(name, recordings);
    }

    yield entryRepository.save(entry);

    yield put(setRecordingEntryAction(entry.toEntryData()));
  } catch (e) {
    // Ignored
  }
}

function* watchGetRecordingEntry() {
  yield takeEvery(RECORDING_ACTION_GET_RECORDING_ENTRY, getRecordingEntry);
}

// TODO: Handle exceptions
function* updateRecordingEntry({ payload: { entry } }: UpdateRecordingEntryAction) {
  try {
    yield entryRepository.updateEntryFromEntryData(entry);
    yield put(setRecordingEntryAction(entry));

    const scheduleEnabled: boolean = yield select(makeSelectSettingScheduleEnabled());

    if (scheduleEnabled && entry.isFromSchedule && entry.scheduleId) {
      try {
        yield ScheduleService.setLectureStatusByEntryStatus(entry.scheduleId, entry.status);
      } catch (e) {
        logger.warn(
          `Failed to set lecture ${entry.scheduleId} as ${entry.status} in Schedule: ${asError(e).message}`,
          asError(e),
        );
      }
      if (entry.status === EntryStatus.ReadyToUpload && entry.endTime) {
        try {
          yield ScheduleService.setLectureEndTime(entry.scheduleId, entry.endTime);
        } catch (e) {
          logger.warn(
            `Failed to set lecture ${entry.scheduleId} as ${entry.status} in Schedule: ${asError(e).message}`,
            asError(e),
          );
        }
      }
    }
  } catch (e) {
    // Ignored
  }
}

function* watchUpdateRecordingEntry() {
  yield takeLatest(RECORDING_ACTION_UPDATE_RECORDING_ENTRY, updateRecordingEntry);
}

function* getRecordingPathFreeSpace({ payload: { recordingPath } }: GetRecordingPathFreeSpaceAction) {
  if (!recordingPath) {
    yield put(setRecordingPathFreeSpaceAction(null));
    return;
  }

  try {
    const { free } = getDiskSpaceInfo(recordingPath);
    yield put(setRecordingPathFreeSpaceAction(free));
  } catch (e) {
    yield put(setRecordingPathFreeSpaceAction(null));
  }
}

function* watchGetRecordingPathFreeSpace() {
  yield takeEvery(RECORDING_ACTION_GET_RECORDING_PATH_FREE_SPACE, getRecordingPathFreeSpace);
}

function* handleRecordingStatusChange({ payload: { status } }: SetRecordingStatusAction) {
  if (status === RecordingStatus.Started) {
    setTrayIcon(TrayIcon.Recording);
    windowManager.getCurrentWindow()?.changeIcon(RECORDING_WINDOW_ICON);
  } else {
    setTrayIcon(TrayIcon.Default);
    windowManager.getCurrentWindow()?.changeIcon(DEFAULT_WINDOW_ICON);

    if (!hasEntitlement(Entitlement.CanRecordOnSchedule)) return;

    const reactivateSchedule: boolean = yield select(makeSelectSettingReactivateSchedule());
    const canEnabledSchedule: boolean = yield select(makeSelectCanEnableSchedule());

    if (reactivateSchedule && canEnabledSchedule && status !== RecordingStatus.Paused) {
      yield put(setMultipleSettingsAction({ scheduleEnabled: true }));
    }
  }
}

function* watchSetRecordingStatus() {
  yield takeEvery(RECORDING_ACTION_SET_RECORDING_STATUS, handleRecordingStatusChange);
}

export function* recordingSaga() {
  yield all([
    fork(watchGetRecordingEntry),
    fork(watchUpdateRecordingEntry),
    fork(watchGetRecordingPathFreeSpace),
    fork(watchSetRecordingStatus),
  ]);
}
