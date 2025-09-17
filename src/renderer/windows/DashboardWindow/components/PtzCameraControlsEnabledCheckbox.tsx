import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { SettingsInputCheckbox, SettingsInputCheckboxProps } from './SettingsInputCheckbox';

type Props = SettingsInputCheckboxProps;

const useStyles = makeStyles()((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
}));

export const PtzCameraControlsEnabledCheckbox: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  return (
    <SettingsInputCheckbox
      label={t<string>('window.dashboard.settings.ptzCameraControlsEnabledCheckbox.label')}
      {...props}
      className={classes.root}
    />
  );
};
