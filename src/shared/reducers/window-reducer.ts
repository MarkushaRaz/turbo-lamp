import { produce } from 'immer';
import { WINDOW_ACTION_SET_TITLE } from '_shared/constants';
import { SetWindowTitleAction, WindowState } from '_shared/types';
import { windowState } from '_shared/states';

export const windowReducer = produce((draft: WindowState, action: SetWindowTitleAction) => {
  switch (action.type) {
    case WINDOW_ACTION_SET_TITLE:
      draft.title = action.payload.title;
      break;
    default:
      return draft;
  }
}, windowState);
