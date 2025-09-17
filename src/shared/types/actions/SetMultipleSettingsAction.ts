import { Action } from 'redux';
import { SETTINGS_ACTION_SET_MULTIPLE } from '_shared/constants';
import { SettingsState } from '_shared/types/state/SettingsState';

export interface SetMultipleSettingsAction extends Action {
  type: typeof SETTINGS_ACTION_SET_MULTIPLE;
  payload: {
    settings: Partial<SettingsState>;
  };
}
