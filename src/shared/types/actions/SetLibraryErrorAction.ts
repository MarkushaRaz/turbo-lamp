import { Action } from 'redux';
import { LIBRARY_ACTION_SET_ERROR } from '_shared/constants';

export interface SetLibraryErrorAction extends Action {
  type: typeof LIBRARY_ACTION_SET_ERROR;
  payload: {
    error: boolean;
  };
}
