import log from 'electron-log';
import { all, fork, select, takeEvery } from 'redux-saga/effects';
import { Entry } from '_main/database/entities';
import { entryRepository } from '_main/database/repositories';
import { ENTRY_ACTION_DELETE_ENTRY } from '_shared/constants';
import { makeSelectSettingScheduleEnabled } from '_shared/selectors';
import { ScheduleService } from '_shared/services';
import { LectureStatus } from '_shared/services/schedule-service/types';
import { DeleteEntryAction } from '_shared/types';
import { asError } from '_shared/utils';

const logger = log.scope('EntrySaga');

// TODO: Handle exceptions
function* deleteEntry({ payload: { entryId, markAsDeletedInSchedule } }: DeleteEntryAction) {
  try {
    const entry: Entry = yield entryRepository.findOneBy({ id: entryId });
    if (!entry) return;

    const scheduleEnabled: boolean = yield select(makeSelectSettingScheduleEnabled());

    if (markAsDeletedInSchedule && scheduleEnabled && entry.isFromSchedule && entry.scheduleId) {
      try {
        yield ScheduleService.updateLecture(entry.scheduleId, { status: LectureStatus.Deleted, end_time: new Date() });
      } catch (e) {
        logger.warn(
          `Failed to set lecture ${entry.scheduleId} as deleted in Schedule: ${asError(e).message}`,
          asError(e),
        );
      }
    }

    yield entryRepository.remove(entry);
  } catch (e) {
    // Ignored
  }
}

function* watchDeleteEntry() {
  yield takeEvery(ENTRY_ACTION_DELETE_ENTRY, deleteEntry);
}

export function* entrySaga() {
  yield all([fork(watchDeleteEntry)]);
}
