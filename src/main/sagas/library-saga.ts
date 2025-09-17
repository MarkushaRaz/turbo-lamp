import { all, fork, put, takeLatest } from 'redux-saga/effects';
import { Entry } from '_main/database/entities';
import { entryRepository } from '_main/database/repositories';
import { setLibraryEntriesAction, setLibraryErrorAction, setLibraryLoadingAction } from '_shared/actions';
import { LIBRARY_ACTION_GET_ENTRIES } from '_shared/constants';
import { EntryData, GetLibraryEntriesAction } from '_shared/types';

function* getLibraryEntries({ payload: { count, page } }: GetLibraryEntriesAction) {
  try {
    yield put(setLibraryLoadingAction(true));
    yield put(setLibraryErrorAction(false));
    const totalCount: number = yield entryRepository.count();
    const list: Entry[] = yield entryRepository.find({
      take: count,
      skip: (page - 1) * count,
      order: { startTime: 'DESC' },
    });
    const entries = list.map<EntryData>((entry) => entry.toEntryData());
    yield put(setLibraryEntriesAction(entries, totalCount));
  } catch (e) {
    yield put(setLibraryErrorAction(true));
  } finally {
    yield put(setLibraryLoadingAction(false));
  }
}

function* watchGetLibraryEntries() {
  yield takeLatest(LIBRARY_ACTION_GET_ENTRIES, getLibraryEntries);
}

export function* librarySaga() {
  yield all([fork(watchGetLibraryEntries)]);
}
