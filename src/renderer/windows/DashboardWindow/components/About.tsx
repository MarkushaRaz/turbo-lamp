import React, { FunctionComponent } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { AppVersion, Grid } from '_renderer/components';

export const About: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet title={t<string>('window.dashboard.about.windowTitle')} />
      <Grid item padded>
        <Typography variant='h6'>
          {t('app.name')} <AppVersion />
        </Typography>
      </Grid>
    </>
  );
};
