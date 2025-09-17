import { AnyAction, combineReducers, EmptyObject } from 'redux';
import { CombinedState } from '_shared/types';
import { CombinedStateKey } from '_shared/enums';
import { appReducer } from './app-reducer';
import { availableSourcesReducer } from './available-sources-reducer';
import { captureSourcesReducer } from './capture-sources-reducer';
import { entryWindowReducer } from './entry-window-reducer';
import { libraryReducer } from './library-reducer';
import { licenseReducer } from './license-reducer';
import { recordingReducer } from './recording-reducer';
import { settingsReducer } from './settings-reducer';
import { windowReducer } from './window-reducer';
import { aktruMeetReducer } from './aktru-meet-reducer';

export function createRootReducer(
  injectedReducers = {},
): (state: (EmptyObject & CombinedState) | undefined, action: AnyAction) => EmptyObject & CombinedState {
  return combineReducers<CombinedState>({
    [CombinedStateKey.AktruMeet]: aktruMeetReducer,
    [CombinedStateKey.App]: appReducer,
    [CombinedStateKey.AvailableSources]: availableSourcesReducer,
    [CombinedStateKey.CaptureSources]: captureSourcesReducer,
    [CombinedStateKey.EntryWindow]: entryWindowReducer,
    [CombinedStateKey.Library]: libraryReducer,
    [CombinedStateKey.License]: licenseReducer,
    [CombinedStateKey.Recording]: recordingReducer,
    [CombinedStateKey.Settings]: settingsReducer,
    [CombinedStateKey.Window]: windowReducer,
    ...injectedReducers,
  });
}
