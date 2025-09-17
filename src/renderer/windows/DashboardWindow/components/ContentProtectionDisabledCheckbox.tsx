import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { Typography } from '@mui/material';
import { SettingsInputCheckbox, SettingsInputCheckboxProps } from './SettingsInputCheckbox';

type Props = SettingsInputCheckboxProps;

const useStyles = makeStyles()((theme) => ({
  root: {
    marginBottom: theme.spacing(0),
  },
  warning: {
    color: theme.palette.warning.main,
    marginLeft: theme.spacing(4),
    position: 'relative',
    top: theme.spacing(-1),
  },
}));

export const ContentProtectionDisabledCheckbox: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  return (
    <>
      <SettingsInputCheckbox
        label={t<string>('window.dashboard.settings.disableContextProtection.label')}
        {...props}
        className={classes.root}
      />
      <Typography variant='caption' className={classes.warning}>
        {t('window.dashboard.settings.disableContextProtection.warning')}
      </Typography>
    </>
  );
};
