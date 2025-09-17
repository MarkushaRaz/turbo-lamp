import {
  WINDOW_ACTION_HIDE,
  WINDOW_ACTION_MINIMIZE,
  WINDOW_ACTION_SET_TITLE,
  WINDOW_ACTION_SHOW,
} from '_shared/constants';
import { HideWindowAction, MinimizeWindowAction, SetWindowTitleAction, ShowWindowAction } from '_shared/types';

export function hideWindowAction(): HideWindowAction {
  return {
    type: WINDOW_ACTION_HIDE,
  };
}

export function minimizeWindowAction(): MinimizeWindowAction {
  return {
    type: WINDOW_ACTION_MINIMIZE,
  };
}

export function showWindowAction(): ShowWindowAction {
  return {
    type: WINDOW_ACTION_SHOW,
  };
}

export function setWindowTitleAction(title: string): SetWindowTitleAction {
  return {
    type: WINDOW_ACTION_SET_TITLE,
    payload: {
      title,
    },
  };
}
