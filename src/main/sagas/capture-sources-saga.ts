import { desktopCapturer, DesktopCapturerSource } from 'electron';
import { all, fork, put, select, takeLeading } from 'redux-saga/effects';
import { CaptureSource, GetAvailableCaptureSourcesAction } from '_shared/types';
import { setAvailableDesktopCaptureSourcesAction, setDesktopCaptureSourceAction } from '_shared/actions';
import { AVAILABLE_SOURCES_ACTION_GET_DESKTOP_CAPTURE_SOURCES } from '_shared/constants';
import i18n from 'i18next';
import { makeSelectLicenseEntitlementsSet } from '_shared/selectors';
import { Entitlement } from '_shared/enums';

function* GetDesktopCaptureSources({ payload }: GetAvailableCaptureSourcesAction) {
  const entitlements: Set<Entitlement> = yield select(makeSelectLicenseEntitlementsSet());

  const sourceTypes = ['screen'];

  if (entitlements.has(Entitlement.CanCaptureWindows)) {
    sourceTypes.push('window');
  }

  const inputSourcesRaw: DesktopCapturerSource[] = yield desktopCapturer.getSources({
    types: sourceTypes,
  });

  if (inputSourcesRaw.length) {
    const inputSources = inputSourcesRaw?.map((source) => {
      const container: CaptureSource = { deviceId: '', deviceName: '' };
      container.deviceName = source.name;
      container.deviceId = source.id;
      return container;
    });

    const inputSourcesWithoutAppWindow = inputSources?.filter((source) => {
      return !source?.deviceName.includes(i18n.t('app.name'));
    });

    const selectedSource = inputSourcesWithoutAppWindow.filter((source) => {
      return source.deviceId === payload?.selectedCaptureSource?.deviceId;
    });

    yield put(setAvailableDesktopCaptureSourcesAction(inputSourcesWithoutAppWindow));

    if (!payload || !selectedSource.length) {
      yield put(setDesktopCaptureSourceAction(inputSourcesWithoutAppWindow[0]));
    }
  } else {
    setDesktopCaptureSourceAction(undefined);
  }
}

function* watchGetDesktopCaptureSources() {
  yield takeLeading(AVAILABLE_SOURCES_ACTION_GET_DESKTOP_CAPTURE_SOURCES, GetDesktopCaptureSources);
}

export function* captureSourcesSaga() {
  yield all([fork(watchGetDesktopCaptureSources)]);
}
