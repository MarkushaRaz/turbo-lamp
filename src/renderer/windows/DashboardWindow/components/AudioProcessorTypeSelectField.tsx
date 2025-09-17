import { MenuItem } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { AudioProcessorType } from '_shared/enums';
import { SettingsSelectField, SettingsSelectFieldProps } from './SettingsSelectField';

type Props = SettingsSelectFieldProps;

export const AudioProcessorTypeSelectField: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <SettingsSelectField
      label={t<string>('window.dashboard.settings.AudioProcessorTypeSelectField.label')}
      options={Object.keys(AudioProcessorType)
        .filter((key) => !!AudioProcessorType[key as keyof typeof AudioProcessorType])
        .map((key) => (
          <MenuItem value={AudioProcessorType[key as keyof typeof AudioProcessorType]} key={key}>
            {key}
          </MenuItem>
        ))}
      {...props}
    />
  );
};
