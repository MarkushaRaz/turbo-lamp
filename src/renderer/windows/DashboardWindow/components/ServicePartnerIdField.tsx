import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsInputField, SettingsInputFieldProps } from './SettingsInputField';

type Props = SettingsInputFieldProps;

export const ServicePartnerIdField: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <SettingsInputField
      inputProps={{ min: 100 }}
      label={t<string>('window.dashboard.settings.servicePartnerIdField.label')}
      placeholder={t<string>('window.dashboard.settings.servicePartnerIdField.placeholder')}
      required
      type='number'
      {...props}
    />
  );
};
