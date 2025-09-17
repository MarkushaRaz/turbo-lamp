import { all, fork, put, select, takeLatest } from 'redux-saga/effects';
import { hasEntitlement } from '_main/utils';
import { setMultipleSettingsAction } from '_shared/actions';
import { LICENSE_ACTION_SET_ENTITLEMENTS } from '_shared/constants';
import { Entitlement } from '_shared/enums';
import { makeSelectCanEnableSchedule, makeSelectSettingReactivateSchedule } from '_shared/selectors';

function* handleCanRecordOnSchedule() {
  const canRecordOnSchedule = hasEntitlement(Entitlement.CanRecordOnSchedule);

  if (canRecordOnSchedule) {
    const hasScheduleReactivation = hasEntitlement(Entitlement.HasScheduleReactivation);
    if (!hasScheduleReactivation) return;

    const reactivateSchedule: boolean = yield select(makeSelectSettingReactivateSchedule());
    const canEnabledSchedule: boolean = yield select(makeSelectCanEnableSchedule());

    if (reactivateSchedule && canEnabledSchedule) {
      yield put(setMultipleSettingsAction({ scheduleEnabled: true }));
    }
  } else {
    yield put(
      setMultipleSettingsAction({
        scheduleCommunicationEnabled: false,
        scheduleEnabled: false,
      }),
    );
  }
}

function* handleEntitlements() {
  yield handleCanRecordOnSchedule();
}

function* watchSetLicenseEntitlements() {
  yield takeLatest(LICENSE_ACTION_SET_ENTITLEMENTS, handleEntitlements);
}

export function* licenseSaga() {
  yield all([fork(watchSetLicenseEntitlements)]);
}
