import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { SettingsInputField, SettingsInputFieldProps } from '../../DashboardWindow/components/SettingsInputField';

type Props = SettingsInputFieldProps;

const useStyles = makeStyles()((theme) => ({
  root: {
    marginTop: theme.spacing(0),
  },
}));

export const EventNameField: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  return (
    <SettingsInputField
      className={classes.root}
      label={t<string>('communication.EventNameField.label')}
      placeholder={t<string>('communication.EventNameField.placeholder')}
      {...props}
    />
  );
};
