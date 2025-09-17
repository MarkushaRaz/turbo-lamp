import React, { FunctionComponent, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Grid, GridSpacer, Window } from '_renderer/components';
import { minimizeWindowAction, switchToWindowAction } from '_shared/actions';
import { WindowRoute } from '_shared/enums';
import { CombinedState } from '_shared/types';
import { createStructuredSelector } from 'reselect';
import { makeSelectConnectionSettingsMissing } from '_shared/selectors';
import log from 'electron-log';
import { Drawer } from './components';
import { DashboardComponentRoute, drawerItems } from './navigation';

const logger = log.scope('DashboardWindows');

interface Selection {
  connectionSettingsMissing: boolean;
}

const stateSelector = createStructuredSelector<CombinedState, Selection>({
  connectionSettingsMissing: makeSelectConnectionSettingsMissing(),
});

export const DashboardWindow: FunctionComponent = () => {
  const { connectionSettingsMissing } = useSelector(stateSelector);
  const dispatch = useDispatch();

  const handleCloseClick = () => {
    logger.info('Close dashboard window');
    dispatch(switchToWindowAction(WindowRoute.MainWindow));
  };

  const handleMinimizeClick = () => {
    logger.info('Minimize dashboard window');
    dispatch(minimizeWindowAction());
  };

  const memoizedDrawerItems = useMemo(
    () =>
      drawerItems.map((item) => {
        if (item.route === DashboardComponentRoute.Settings) {
          item.hasError = connectionSettingsMissing;
        }
        return item;
      }),
    [connectionSettingsMissing],
  );

  return (
    <Window
      controlsProps={{
        onCloseClick: handleCloseClick,
        onMinimizeClick: handleMinimizeClick,
      }}
      showControls
      showTitleBar
      showStatusBar
    >
      <Grid container fillHeight>
        <Grid container item scrollY shrink={0}>
          <Drawer items={memoizedDrawerItems} />
        </Grid>
        <GridSpacer rightBorder />
        <Grid container direction='column' item grow={1} paper scrollY>
          <Outlet />
        </Grid>
      </Grid>
    </Window>
  );
};
