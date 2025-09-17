import React, { FunctionComponent } from 'react';
import MuteIcon from '@mui/icons-material/Mic';
import UnmuteIcon from '@mui/icons-material/MicOff';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { ButtonControl, RecordControlProps } from './ButtonControl';

type Props = Pick<RecordControlProps, 'enabled' | 'onClick'> & {
  isMuted: boolean;
  selectorState?: boolean;
  onClickSelector?: () => void;
};

const useStyles = makeStyles<Pick<Props, 'selectorState'>>()((_theme, { selectorState }) => ({
  container: {
    maxWidth: 45,
    maxHeight: 35,
    minWidth: selectorState === undefined ? 0 : 40,
  },
  chevronContainer: {
    position: 'relative',
    bottom: 35,
    left: 25,
    maxWidth: 16,
    maxHeight: 16,
    cursor: 'pointer',
  },
  chevron: {
    position: 'relative',
    width: 20,
    height: 20,
    top: -2,
    left: -2,
  },
}));

export const MuteMicrophoneAudioButton: FunctionComponent<Props> = ({
  enabled,
  isMuted,
  selectorState,
  onClickSelector,
  onClick,
}: Props) => {
  const { t } = useTranslation();
  const icon = isMuted ? UnmuteIcon : MuteIcon;
  const title = isMuted
    ? t('window.recording.muteMicrophoneAudioButton.unmute.title')
    : t('window.recording.muteMicrophoneAudioButton.mute.title');
  const { classes } = useStyles({
    selectorState,
  });

  const KeyboardArrowIcon = selectorState ? KeyboardArrowDown : KeyboardArrowUp;

  return (
    <div className={classes.container}>
      <ButtonControl title={title} onClick={onClick} Icon={icon} width='normal' enabled={enabled} />
      {selectorState !== undefined && (
        <div onClick={onClickSelector} className={classes.chevronContainer}>
          <KeyboardArrowIcon fontSize='inherit' className={classes.chevron} />
        </div>
      )}
    </div>
  );
};

MuteMicrophoneAudioButton.defaultProps = {
  selectorState: undefined,
  onClickSelector: undefined,
};
