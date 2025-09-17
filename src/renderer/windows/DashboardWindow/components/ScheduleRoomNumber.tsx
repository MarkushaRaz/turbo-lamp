import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsInputField, SettingsInputFieldProps } from './SettingsInputField';

type Props = SettingsInputFieldProps;

export const ScheduleRoomNumber: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <SettingsInputField
      label={t<string>('window.dashboard.settings.scheduleRoomNumber.label')}
      maxLength={32}
      placeholder={t<string>('window.dashboard.settings.scheduleRoomNumber.placeholder')}
      required
      {...props}
    />
  );
};
