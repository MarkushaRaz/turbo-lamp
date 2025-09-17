import { produce } from 'immer';
import { APP_ACTION_SET_APP_UUID, APP_ACTION_SET_APP_VERSION, APP_ACTION_SET_FINGERPRINT } from '_shared/constants';
import { AppState, SetAppUuidAction, SetAppVersionAction, SetFingerprintAction } from '_shared/types';
import { appState } from '_shared/states';

export const appReducer = produce(
  (draft: AppState, action: SetAppUuidAction | SetAppVersionAction | SetFingerprintAction) => {
    switch (action.type) {
      case APP_ACTION_SET_APP_UUID:
        draft.uuid = action.payload.uuid;
        break;
      case APP_ACTION_SET_APP_VERSION:
        draft.version = action.payload.version;
        break;
      case APP_ACTION_SET_FINGERPRINT:
        draft.fingerprint = action.payload.fingerprint;
        break;
      default:
        return draft;
    }
  },
  appState,
);
