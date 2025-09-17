import {
  APP_ACTION_QUIT_APP,
  APP_ACTION_SET_APP_UUID,
  APP_ACTION_SET_APP_VERSION,
  APP_ACTION_SET_FINGERPRINT,
  APP_ACTION_SHOW_ERROR_BOX,
  APP_ACTION_SWITCH_TO_ENTRY_WINDOW,
  APP_ACTION_SWITCH_TO_WINDOW,
} from '_shared/constants';
import {
  EntryData,
  QuitAppAction,
  SetAppUuidAction,
  SetAppVersionAction,
  SetFingerprintAction,
  ShowErrorBoxAction,
  SwitchToEntryWindowAction,
  SwitchToWindowAction,
} from '_shared/types';
import { EntryWindowMode, WindowRoute } from '_shared/enums';

export function setAppUuidAction(uuid: string): SetAppUuidAction {
  return {
    type: APP_ACTION_SET_APP_UUID,
    payload: {
      uuid,
    },
  };
}

export function setAppVersionAction(version: string): SetAppVersionAction {
  return {
    type: APP_ACTION_SET_APP_VERSION,
    payload: {
      version,
    },
  };
}

export function setFingerprintAction(fingerprint: string): SetFingerprintAction {
  return {
    type: APP_ACTION_SET_FINGERPRINT,
    payload: {
      fingerprint,
    },
  };
}

export function showErrorBoxAction(title: string, content: string): ShowErrorBoxAction {
  return {
    type: APP_ACTION_SHOW_ERROR_BOX,
    payload: {
      title,
      content,
    },
  };
}

export function switchToEntryWindowAction(entry: EntryData, mode: EntryWindowMode): SwitchToEntryWindowAction {
  return {
    type: APP_ACTION_SWITCH_TO_ENTRY_WINDOW,
    payload: {
      entry,
      mode,
    },
  };
}

export function switchToWindowAction(route: WindowRoute, hidden = false): SwitchToWindowAction {
  return {
    type: APP_ACTION_SWITCH_TO_WINDOW,
    payload: {
      route,
      hidden,
    },
  };
}

export function quitAppAction(): QuitAppAction {
  return {
    type: APP_ACTION_QUIT_APP,
  };
}
