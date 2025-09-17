import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsInputField, SettingsInputFieldProps } from './SettingsInputField';

type Props = SettingsInputFieldProps;

export const ScheduleUrlField: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <SettingsInputField
      label={t<string>('window.dashboard.settings.scheduleUrlField.label')}
      placeholder={t<string>('window.dashboard.settings.scheduleUrlField.placeholder')}
      required
      {...props}
    />
  );
};
