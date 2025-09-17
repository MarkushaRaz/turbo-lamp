import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsInputField, SettingsInputFieldProps } from './SettingsInputField';

type Props = SettingsInputFieldProps;

export const ServiceUrlField: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <SettingsInputField
      label={t<string>('window.dashboard.settings.serviceUrlField.label')}
      placeholder={t<string>('window.dashboard.settings.serviceUrlField.placeholder')}
      required
      {...props}
    />
  );
};
