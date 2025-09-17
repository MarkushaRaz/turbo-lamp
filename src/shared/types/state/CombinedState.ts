import { PersistState } from 'redux-persist/es/types';
import { AppState } from '_shared/types/state/AppState';
import { CombinedStateKey } from '_shared/enums';
import { AvailableSourcesState } from '_shared/types/state/AvailableSourcesState';
import { CaptureSourcesState } from '_shared/types/state/CaptureSourcesState';
import { EntryWindowState } from '_shared/types/state/EntryWindowState';
import { LibraryState } from '_shared/types/state/LibraryState';
import { LicenseState } from '_shared/types/state/LicenseState';
import { RecordingState } from '_shared/types/state/RecordingState';
import { SettingsState } from '_shared/types/state/SettingsState';
import { WindowState } from '_shared/types/state/WindowState';
import { AktruMeetState } from '_shared/types/state/AktruMeetState';

export interface CombinedState {
  [CombinedStateKey.AktruMeet]: AktruMeetState;
  [CombinedStateKey.App]: AppState;
  [CombinedStateKey.AvailableSources]: AvailableSourcesState;
  [CombinedStateKey.CaptureSources]: CaptureSourcesState;
  [CombinedStateKey.EntryWindow]: EntryWindowState;
  [CombinedStateKey.Library]: LibraryState;
  [CombinedStateKey.License]: LicenseState;
  [CombinedStateKey.Persist]?: PersistState;
  [CombinedStateKey.Recording]: RecordingState;
  [CombinedStateKey.Settings]: SettingsState;
  [CombinedStateKey.Window]: WindowState;
}
