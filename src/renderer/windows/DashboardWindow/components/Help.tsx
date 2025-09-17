import React, { FunctionComponent } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Grid } from '_renderer/components';

export const Help: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet title={t<string>('window.dashboard.help.windowTitle')} />
      <Grid item padded>
        {t('window.dashboard.help.windowTitle')}
      </Grid>
    </>
  );
};
