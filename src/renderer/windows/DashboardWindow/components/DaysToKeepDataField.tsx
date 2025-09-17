import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { SettingsInputField, SettingsInputFieldProps } from './SettingsInputField';

type Props = SettingsInputFieldProps;

const useStyles = makeStyles()(() => ({
  root: {
    marginBottom: 0,
  },
}));

export const DaysToKeepDataField: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  return (
    <SettingsInputField
      className={classes.root}
      helperText={t<string>('window.dashboard.settings.daysToKeepData.helperText')}
      inputProps={{ min: 0 }}
      label={t<string>('window.dashboard.settings.daysToKeepData.label')}
      placeholder={t<string>('window.dashboard.settings.daysToKeepData.placeholder')}
      required
      type='number'
      {...props}
    />
  );
};
