import { getState, getStore } from '_main/providers';
import { RecordingStatus, WindowRoute } from '_shared/enums';
import { IS_DEV } from '_shared/constants';
import { windowManager } from '_main/window-manager';
import { RecordingWindow } from '_main/windows';
import { isEqual, isNumber } from 'lodash';
import { app, ipcMain } from 'electron';
import {
  hideWindowAction,
  showWindowAction,
  recallPtzCameraPresetAction,
  recallAudioProcessorPresetAction,
} from '_shared/actions';
import log from 'electron-log';

import {
  SDRecorderFunctions,
  SDRecorderRecordingStates,
  SDRecorderErrorCodes,
  StreamDeckServerState,
  SDRecorderInterfaceStates,
  StreamDeckMessage,
} from './types';

import { StreamDeckServer } from './stream-deck-server';

const logger = log.scope('StreamDeckService');

let currentCameraPreset: number;
let currentAudioPreset: number;

async function onStartRecording(server: StreamDeckServer) {
  const state = getState();
  const window = windowManager.getCurrentWindow();
  const successMessage = {
    code: SDRecorderErrorCodes.OK,
    message: 'Recording started',
  };

  if (state.recording.status === RecordingStatus.Started) {
    return {
      code: SDRecorderErrorCodes.ERR_NO_EFFECT,
      message: 'Recording already started',
    };
  }

  if (window?.className !== RecordingWindow.name) {
    windowManager.load(WindowRoute.RecordingWindow);
    return successMessage;
  }

  window?.getBrowserWindow()?.webContents.send('stream-deck', { event: 'pause-recording' });
  server.currentState.recording = SDRecorderRecordingStates.RECORDING;
  return successMessage;
}

async function onPauseRecording(server: StreamDeckServer) {
  const state = getState();
  if (state.recording.status === RecordingStatus.Paused) {
    return {
      code: SDRecorderErrorCodes.ERR_NO_EFFECT,
      message: 'Recording already paused',
    };
  }

  if (state.recording.status !== RecordingStatus.Started) {
    return {
      code: SDRecorderErrorCodes.ERR_BLOCKED_BY_STATE,
      message: 'Recorder is not recording now',
    };
  }

  windowManager.getCurrentWindow()?.getBrowserWindow()?.webContents.send('stream-deck', { event: 'pause-recording' });
  server.currentState.recording = SDRecorderRecordingStates.PAUSED;
  return {
    code: SDRecorderErrorCodes.OK,
    message: 'Recording paused',
  };
}

async function onStopRecording(server: StreamDeckServer) {
  const state = getState();

  if (state.recording.status !== RecordingStatus.Started && state.recording.status !== RecordingStatus.Paused) {
    return {
      code: SDRecorderErrorCodes.ERR_NO_EFFECT,
      message: 'Recorder is not recording now',
    };
  }

  windowManager.getCurrentWindow()?.getBrowserWindow()?.webContents.send('stream-deck', { event: 'stop-recording' });
  server.currentState.recording = SDRecorderRecordingStates.IDLE;
  return {
    code: SDRecorderErrorCodes.OK,
    message: 'Recording stopped',
  };
}

async function onCancelRecording(server: StreamDeckServer) {
  const state = getState();

  if (state.recording.status !== RecordingStatus.Started && state.recording.status !== RecordingStatus.Paused) {
    return {
      code: SDRecorderErrorCodes.ERR_NO_EFFECT,
      message: 'Recorder is not recording now',
    };
  }

  windowManager.getCurrentWindow()?.getBrowserWindow()?.webContents.send('stream-deck', { event: 'cancel-recording' });
  server.currentState.recording = SDRecorderRecordingStates.IDLE;
  return {
    code: SDRecorderErrorCodes.OK,
    message: 'Recording canceled',
  };
}

function onShowInterface(server: StreamDeckServer) {
  if (server.currentState.interface === SDRecorderInterfaceStates.NORMAL) {
    return {
      code: SDRecorderErrorCodes.ERR_NO_EFFECT,
      message: 'Already shown',
    };
  }

  getStore().dispatch(showWindowAction());
  server.currentState.interface = SDRecorderInterfaceStates.NORMAL;
  return {
    code: SDRecorderErrorCodes.OK,
    message: 'OK',
  };
}

function onHideInterface(server: StreamDeckServer) {
  if (server.currentState.interface === SDRecorderInterfaceStates.TRAY) {
    return {
      code: SDRecorderErrorCodes.ERR_NO_EFFECT,
      message: 'Already hidden',
    };
  }

  getStore().dispatch(hideWindowAction());
  server.currentState.interface = SDRecorderInterfaceStates.TRAY;
  return {
    code: SDRecorderErrorCodes.OK,
    message: 'OK',
  };
}

async function onSwitchCameraPreset(server: StreamDeckServer, eventObj: object) {
  if (!getState().settings.ptzCameraControlsEnabled) {
    return {
      code: SDRecorderErrorCodes.ERR_BLOCKED_BY_STATE,
      message: 'PTZ-camera control is disabled',
    };
  }

  if (
    'data' in eventObj &&
    typeof eventObj.data === 'object' &&
    eventObj.data &&
    'preset' in eventObj.data &&
    isNumber(eventObj.data.preset) &&
    eventObj.data.preset > 0 &&
    eventObj.data.preset <= server.cameraMaxPreset
  ) {
    const preset = Number(eventObj.data.preset);
    server.currentState.cameraPreset = preset;
    currentCameraPreset = preset;
    getStore().dispatch(recallPtzCameraPresetAction(preset));
    return {
      code: SDRecorderErrorCodes.OK,
      message: 'OK',
    };
  }

  return {
    code: SDRecorderErrorCodes.ERR_INVALID_PARAMETER,
    message: 'Missing or invalid state parameter',
  };
}

async function onSwitchAudioPreset(server: StreamDeckServer, eventObj: StreamDeckMessage) {
  if (
    'data' in eventObj &&
    typeof eventObj.data === 'object' &&
    eventObj.data &&
    'preset' in eventObj.data &&
    isNumber(eventObj.data.preset) &&
    eventObj.data.preset > 0 &&
    eventObj.data.preset <= server.audioMaxPreset
  ) {
    const presetIndex = eventObj.data.preset;
    if (!getState().settings.audioProcessorControlsEnabled) {
      return {
        code: SDRecorderErrorCodes.ERR_BLOCKED_BY_STATE,
        message: 'Audio processor control is disabled',
      };
    }
    server.currentState.audioPrimaryEnabled = presetIndex === 2;
    server.currentState.audioPreset = presetIndex;
    currentAudioPreset = presetIndex;
    getStore().dispatch(recallAudioProcessorPresetAction(presetIndex));
    return {
      code: SDRecorderErrorCodes.OK,
      message: 'OK',
    };
  }

  return {
    code: SDRecorderErrorCodes.ERR_INVALID_PARAMETER,
    message: 'Missing or invalid preset parameter',
  };
}

function translateCurrentState(): StreamDeckServerState {
  const state = getState();
  let SDRecordingState: number = SDRecorderRecordingStates.IDLE;
  switch (state.recording.status) {
    case RecordingStatus.Paused:
      SDRecordingState = SDRecorderRecordingStates.PAUSED;
      break;
    case RecordingStatus.Started:
      SDRecordingState = SDRecorderRecordingStates.RECORDING;
      break;
    default:
      SDRecordingState = SDRecorderRecordingStates.IDLE;
  }

  const window = windowManager.getCurrentWindow();
  const isVisible = window?.className === RecordingWindow.name ? !window.isMinimized() : window?.isVisible();
  return {
    recording: SDRecordingState,
    cameraPreset: currentCameraPreset,
    interface: isVisible === true ? SDRecorderInterfaceStates.NORMAL : SDRecorderInterfaceStates.TRAY,
    audioPreset: currentAudioPreset,
    audioPrimaryEnabled: currentAudioPreset === 2,
  };
}

export function start() {
  logger.info('Starting stream deck service');
  const state = getState();
  currentCameraPreset = state.settings.ptzCameraDefaultPresetIndex;

  const server = new StreamDeckServer({
    ports: [9000, 9090],
    audioMaxPreset: 3,
    cameraMaxPreset: 4,
    debug: IS_DEV,
    initialState: translateCurrentState(),
  });

  server.on(SDRecorderFunctions.START_RECORDING, () => onStartRecording(server));
  server.on(SDRecorderFunctions.PAUSE_RECORDING, () => onPauseRecording(server));
  server.on(SDRecorderFunctions.STOP_RECORDING, () => onStopRecording(server));
  server.on(SDRecorderFunctions.SWITCH_CAMERA_PRESET, (obj) => onSwitchCameraPreset(server, obj));
  server.on(SDRecorderFunctions.DELETE_RECORD, () => onCancelRecording(server));
  server.on(SDRecorderFunctions.SHOW_INTERFACE, () => onShowInterface(server));
  server.on(SDRecorderFunctions.HIDE_INTERFACE, () => onHideInterface(server));
  server.on(SDRecorderFunctions.ENABLE_PRIMARY_AUDIO, () =>
    onSwitchAudioPreset(server, { event: SDRecorderFunctions.ENABLE_PRIMARY_AUDIO, data: { preset: 2 } }),
  );
  server.on(SDRecorderFunctions.DISABLE_PRIMARY_AUDIO, () =>
    onSwitchAudioPreset(server, { event: SDRecorderFunctions.DISABLE_PRIMARY_AUDIO, data: { preset: 1 } }),
  );
  server.on(SDRecorderFunctions.SWITCH_AUDIO_PRESET, (obj) => onSwitchAudioPreset(server, obj));

  const store = getStore();

  if (state.settings.audioProcessorControlsEnabled) {
    store.dispatch(recallAudioProcessorPresetAction(1));
  }

  const recorderEventHandler = () => {
    const previousState = server.currentState;
    const currentState = translateCurrentState();
    if (!isEqual(previousState, currentState)) {
      server.currentState = currentState;
      server.notifyStateChanged();
    }
  };

  app.on('browser-window-focus', recorderEventHandler);
  app.on('browser-window-blur', recorderEventHandler);
  // TODO This is inefficient because the handler is being invoked on every single state update, even those that might be irrelevant for the handler
  store.subscribe(recorderEventHandler);

  ipcMain.on('camera-preset-changed', (_event, data) => {
    currentCameraPreset = data.preset;
    recorderEventHandler();
  });
  return server;
}
