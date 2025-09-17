import { createSelector } from 'reselect';
import { CombinedState, WindowState } from '_shared/types';
import { windowState } from '_shared/states';
import { CombinedStateKey } from '_shared/enums';

const selectWindowDomain = (state: CombinedState): WindowState => state[CombinedStateKey.Window] || windowState;

export const makeSelectWindowState = () => createSelector(selectWindowDomain, (substate: WindowState) => substate);

export const makeSelectWindowTitle = () =>
  createSelector(selectWindowDomain, (substate: WindowState) => substate.title);

export default selectWindowDomain;
