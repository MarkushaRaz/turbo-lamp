import React from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { CssBaseline } from '@mui/material';
import { AppStyles } from '_renderer/styles';
import { Router } from '_renderer/containers/Router';
import { setWindowTitleAction } from '_shared/actions';

const TITLE_PART_SEPARATOR = ' • ';

export function App() {
  const { t } = useTranslation();
  const defaultTitle = t('app.name');
  const titleTemplate = `%s${TITLE_PART_SEPARATOR}${defaultTitle}`;
  const dispatch = useDispatch();

  const handleClientStateChange = (newState: { title: string }) => {
    dispatch(setWindowTitleAction(newState.title));
  };

  return (
    <>
      <Helmet titleTemplate={titleTemplate} defaultTitle={defaultTitle} onChangeClientState={handleClientStateChange} />
      <CssBaseline />
      <AppStyles />
      <Router />
    </>
  );
}
