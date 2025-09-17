import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { SettingsInputCheckbox, SettingsInputCheckboxProps } from './SettingsInputCheckbox';

type Props = SettingsInputCheckboxProps;

const useStyles = makeStyles()(() => ({
  root: {},
}));

export const MicrophoneEnabledCheckbox: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  return (
    <SettingsInputCheckbox
      label={t<string>('window.dashboard.settings.microphoneEnabledCheckbox.label')}
      {...props}
      className={classes.root}
    />
  );
};
