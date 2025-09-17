import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { SettingsInputField, SettingsInputFieldProps } from './SettingsInputField';

type Props = SettingsInputFieldProps;

const useStyles = makeStyles()((theme) => ({
  root: {
    marginTop: theme.spacing(0),
  },
}));

export const BroadcastsKeyField: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  return (
    <SettingsInputField
      className={classes.root}
      label={t<string>('window.dashboard.settings.broadcastsKeyField.label')}
      placeholder={t<string>('window.dashboard.settings.broadcastsKeyField.placeholder')}
      {...props}
    />
  );
};
