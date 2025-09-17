import React, { FunctionComponent } from 'react';
import { VolumeOff as UnmuteIcon, VolumeUp as MuteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Theme, lighten, darken } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { ButtonControl, RecordControlProps } from './ButtonControl';

type Props = Pick<RecordControlProps, 'enabled' | 'onClick'> & {
  isMuted: boolean;
};

const useStyles = makeStyles<Pick<Props, 'enabled'>>()((_theme: Theme, { enabled }) => {
  const baseColor = '#5B1E58';
  return {
    root: {
      color: enabled ? baseColor : lighten(baseColor, 0.5),
      '&:hover': {
        color: darken(baseColor, 0.3),
      },
    },
  };
});

export const MuteDesktopAudioButton: FunctionComponent<Props> = ({ enabled, isMuted, onClick }: Props) => {
  const { t } = useTranslation();
  const { classes } = useStyles({ enabled });
  const icon = isMuted ? UnmuteIcon : MuteIcon;
  const title = isMuted
    ? t('window.recording.muteDesktopAudioButton.unmute.title')
    : t('window.recording.muteDesktopAudioButton.mute.title');
  return (
    <ButtonControl
      className={classes.root}
      title={title}
      onClick={onClick}
      Icon={icon}
      width='normal'
      enabled={enabled}
    />
  );
};
