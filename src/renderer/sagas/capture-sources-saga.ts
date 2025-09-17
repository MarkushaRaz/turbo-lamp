import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { CaptureSource, GetAvailableCaptureSourcesAction } from '_/shared/types';
import {
  setAudioCaptureSourceAction,
  setAvailableAudioCaptureSourcesAction,
  setAvailableCameraCaptureSourcesAction,
  setCameraCaptureSourceAction,
  setDesktopCaptureSourceAction,
} from '_shared/actions';
import {
  AVAILABLE_SOURCES_ACTION_GET_AUDIO_CAPTURE_SOURCES,
  AVAILABLE_SOURCES_ACTION_GET_CAMERA_CAPTURE_SOURCES,
} from '_shared/constants';
import { RecordingSource } from '_shared/enums';
import log from 'electron-log';

const logger = log.scope('CaptureSourceSaga');

const OBS_CAMERA_NAME = 'OBS Virtual Camera';

function mediaDevicesToCaptureSources(devices: MediaDeviceInfo[]) {
  logger.info('Convert media devices to capture source');
  return devices.map((source) => {
    const container: CaptureSource = { deviceId: '', deviceName: '' };
    container.deviceName = source.label;
    container.deviceId = source.deviceId;
    return container;
  });
}

function* GetAudioCaptureSources({ payload: { selectedCaptureSource } }: GetAvailableCaptureSourcesAction) {
  logger.info('Get audio capture sources');
  const audioInputDevices: MediaDeviceInfo[] = [];
  const allDevices: MediaDeviceInfo[] = yield navigator.mediaDevices.enumerateDevices();

  if (allDevices.length) {
    allDevices?.forEach((source) => {
      if (source.kind === 'audioinput') {
        logger.info(`Audio source ${source.deviceId} - ${source.label} was found`);
        audioInputDevices.push(source);
      }
    });

    const inputSources = mediaDevicesToCaptureSources(audioInputDevices);

    yield put(setAvailableAudioCaptureSourcesAction(inputSources));

    const selectedSourceConnected = inputSources.some((source) => {
      return source.deviceId === selectedCaptureSource?.deviceId;
    });

    if (!selectedCaptureSource || !selectedSourceConnected) {
      yield put(setAudioCaptureSourceAction(inputSources[0]));
      logger.info(`No selected audio source found. Defaulting to the first source: ${inputSources[0].deviceName}`);
    } else {
      logger.info(`Selected audio source found: ${selectedCaptureSource.deviceName}`);
    }
  } else {
    logger.warn('No audio capture sources connected');
    setAudioCaptureSourceAction(undefined);
  }
}

function* GetCameraCaptureSources({
  payload: { selectedCaptureSource, sourceType },
}: GetAvailableCaptureSourcesAction) {
  logger.info('Get camera capture sources');
  const videoInputDevices: MediaDeviceInfo[] = [];
  const allDevices: MediaDeviceInfo[] = yield navigator.mediaDevices.enumerateDevices();

  const setSourceAction =
    sourceType === RecordingSource.Desktop ? setDesktopCaptureSourceAction : setCameraCaptureSourceAction;

  if (allDevices.length) {
    allDevices?.forEach((source) => {
      if (source.kind === 'videoinput') {
        logger.info(`Camera source ${source.deviceId} - ${source.label} was found`);
        videoInputDevices.push(source);
      }
    });

    const inputSources = mediaDevicesToCaptureSources(videoInputDevices);

    yield put(setAvailableCameraCaptureSourcesAction(inputSources));

    let selectedSourceConnected = inputSources.some((source) => {
      return source.deviceId === selectedCaptureSource?.deviceId;
    });

    if (!selectedSourceConnected && selectedCaptureSource?.deviceName === OBS_CAMERA_NAME) {
      const obsSource = inputSources.find((source) => {
        return source.deviceName === OBS_CAMERA_NAME;
      });

      if (obsSource) {
        yield put(setSourceAction(obsSource));
        selectedSourceConnected = true;
      }
    }

    if (!selectedCaptureSource || !selectedSourceConnected) {
      yield put(setSourceAction(inputSources[0]));
      logger.info(
        `No selected ${sourceType?.toLowerCase()} source found. Defaulting to the first source: ${
          inputSources[0].deviceName
        }`,
      );
    } else {
      logger.info(`Selected ${sourceType?.toLowerCase()} source found: ${selectedCaptureSource.deviceName}`);
    }
  } else {
    logger.warn(`No ${sourceType?.toLowerCase()} capture sources connected`);
    yield put(setSourceAction(undefined));
  }
}

function* watchGetAudioCaptureSources() {
  yield takeEvery(AVAILABLE_SOURCES_ACTION_GET_AUDIO_CAPTURE_SOURCES, GetAudioCaptureSources);
}

function* watchGetCameraCaptureSources() {
  yield takeEvery(AVAILABLE_SOURCES_ACTION_GET_CAMERA_CAPTURE_SOURCES, GetCameraCaptureSources);
}

export function* captureSourcesSaga() {
  yield all([fork(watchGetAudioCaptureSources), fork(watchGetCameraCaptureSources)]);
}
