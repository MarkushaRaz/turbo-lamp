import { MenuItem } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { VideoCodec } from '_/shared/enums';
import { SettingsSelectField, SettingsSelectFieldProps } from './SettingsSelectField';

type Props = SettingsSelectFieldProps;

export const VideoCodecSelectField: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <SettingsSelectField
      label={t<string>('window.dashboard.settings.videoCodecSelectField.label')}
      options={Object.keys(VideoCodec)
        .filter((key) => !!VideoCodec[key as keyof typeof VideoCodec])
        .map((key) => (
          <MenuItem value={VideoCodec[key as keyof typeof VideoCodec]} key={key}>
            {key}
          </MenuItem>
        ))}
      {...props}
    />
  );
};
