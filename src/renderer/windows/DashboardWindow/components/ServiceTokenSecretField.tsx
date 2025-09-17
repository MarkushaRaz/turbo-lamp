import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsInputField, SettingsInputFieldProps } from './SettingsInputField';

type Props = SettingsInputFieldProps;

export const ServiceTokenSecretField: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <SettingsInputField
      label={t<string>('window.dashboard.settings.serviceTokenSecretField.label')}
      placeholder={t<string>('window.dashboard.settings.serviceTokenSecretField.placeholder')}
      type='password'
      required
      {...props}
    />
  );
};
