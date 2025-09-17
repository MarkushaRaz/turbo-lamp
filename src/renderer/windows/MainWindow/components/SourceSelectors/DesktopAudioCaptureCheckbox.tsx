import React, { FunctionComponent, HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { Checkbox, FormControlLabel } from '@mui/material';

interface Props extends HTMLAttributes<HTMLDivElement> {
  desktopAudioCaptureEnabled: boolean;
  onToggleDesktopAudioCaptureStatus?(): void;
}

const useStyles = makeStyles()(() => ({
  label: {
    fontSize: '14px',
  },
}));

export const DesktopAudioCaptureCheckbox: FunctionComponent<Props> = ({
  desktopAudioCaptureEnabled,
  onToggleDesktopAudioCaptureStatus,
}: Props) => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  return (
    <FormControlLabel
      classes={{
        label: classes.label,
      }}
      control={
        <Checkbox checked={desktopAudioCaptureEnabled} onChange={onToggleDesktopAudioCaptureStatus} color='primary' />
      }
      label={t<string>('window.main.desktopAudioCaptureEnabled.title')}
    />
  );
};

DesktopAudioCaptureCheckbox.defaultProps = {
  onToggleDesktopAudioCaptureStatus: undefined,
};
