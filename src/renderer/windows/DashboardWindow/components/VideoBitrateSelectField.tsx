import { MenuItem } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { VideoBitrate } from '_/shared/enums';
import { SettingsSelectField, SettingsSelectFieldProps } from './SettingsSelectField';

type Props = SettingsSelectFieldProps;

export const VideoBitrateSelectField: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  return (
    <SettingsSelectField
      label={t<string>('window.dashboard.settings.videoBitrateSelectField.label')}
      options={Object.values<number | string>(VideoBitrate)
        .filter((value) => typeof value === 'number')
        .map((value) => (
          <MenuItem value={value} key={value}>
            {value}
          </MenuItem>
        ))}
      {...props}
    />
  );
};
