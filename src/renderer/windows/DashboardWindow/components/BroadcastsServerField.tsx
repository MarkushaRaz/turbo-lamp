import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { SettingsInputField, SettingsInputFieldProps } from './SettingsInputField';

type Props = SettingsInputFieldProps;

const useStyles = makeStyles()((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
}));

export const BroadcastsServerField: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  return (
    <SettingsInputField
      className={classes.root}
      label={t<string>('window.dashboard.settings.broadcastsServerField.label')}
      placeholder={t<string>('window.dashboard.settings.broadcastsServerField.placeholder')}
      {...props}
    />
  );
};
