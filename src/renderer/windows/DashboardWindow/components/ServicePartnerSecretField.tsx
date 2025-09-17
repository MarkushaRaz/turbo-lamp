import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsInputField, SettingsInputFieldProps } from './SettingsInputField';

type Props = SettingsInputFieldProps;

export const ServicePartnerSecretField: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <SettingsInputField
      label={t<string>('window.dashboard.settings.servicePartnerSecretField.label')}
      placeholder={t<string>('window.dashboard.settings.servicePartnerSecretField.placeholder')}
      type='password'
      required
      {...props}
    />
  );
};
