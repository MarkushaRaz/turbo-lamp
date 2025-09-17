import React, { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router-dom';
import { WindowRoute } from '_shared/enums';
import {
  DashboardWindow,
  EntryWindow,
  MainWindow,
  RecordingWindow,
  SplashWindow,
  ConferenceWindow,
  CommunicationWindow,
} from '_renderer/windows';
import { DashboardComponentRoute } from '_renderer/windows/DashboardWindow/navigation';
import { Library, Settings } from '_renderer/windows/DashboardWindow/containers';
import { About, Help } from '_renderer/windows/DashboardWindow/components';

export const Router: FunctionComponent = () => {
  return (
    <Routes>
      <Route path={WindowRoute.DashboardWindow} element={<DashboardWindow />}>
        <Route path={DashboardComponentRoute.Library} element={<Library />} />
        <Route path={DashboardComponentRoute.Settings} element={<Settings />} />
        <Route path={DashboardComponentRoute.Help} element={<Help />} />
        <Route path={DashboardComponentRoute.About} element={<About />} />
      </Route>
      <Route path={WindowRoute.EntryWindow} element={<EntryWindow />} />
      <Route path={WindowRoute.MainWindow} element={<MainWindow />} />
      <Route path={WindowRoute.RecordingWindow} element={<RecordingWindow />} />
      <Route path={WindowRoute.ConferenceWindow} element={<ConferenceWindow />} />
      <Route path={WindowRoute.CommunicationWindow} element={<CommunicationWindow />} />
      <Route path={WindowRoute.SplashWindow} element={<SplashWindow />} />
    </Routes>
  );
};
