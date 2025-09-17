import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsInputCheckbox, SettingsInputCheckboxProps } from './SettingsInputCheckbox';

type Props = SettingsInputCheckboxProps;

export const AutostartBroadcastsEnabledCheckbox: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  return (
    <SettingsInputCheckbox
      label={t<string>('window.dashboard.settings.AutostartBroadcastsEnabledCheckbox.label')}
      {...props}
    />
  );
};
