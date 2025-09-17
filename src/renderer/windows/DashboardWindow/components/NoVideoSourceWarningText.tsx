import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  root: {
    color: theme.palette.warning.main,
  },
}));

export const NoVideoSourceWarningText: FunctionComponent = () => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  return (
    <Typography variant='caption' className={classes.root}>
      {t('window.dashboard.settings.noVideoSourceWarning.text')}
    </Typography>
  );
};
