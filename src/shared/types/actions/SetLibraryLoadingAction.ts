import { Action } from 'redux';
import { LIBRARY_ACTION_SET_LOADING } from '_shared/constants';

export interface SetLibraryLoadingAction extends Action {
  type: typeof LIBRARY_ACTION_SET_LOADING;
  payload: {
    loading: boolean;
  };
}
