import { Action } from 'redux';
import { LIBRARY_ACTION_SET_PAGE } from '_shared/constants';

export interface SetLibraryPageAction extends Action {
  type: typeof LIBRARY_ACTION_SET_PAGE;
  payload: {
    page: number;
  };
}
