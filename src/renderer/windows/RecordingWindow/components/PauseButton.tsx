import React, { FunctionComponent } from 'react';
import PauseIcon from '@mui/icons-material/Pause';
import PlayIcon from '@mui/icons-material/PlayArrow';
import { useTranslation } from 'react-i18next';
import { ButtonControl, RecordControlProps } from './ButtonControl';

type Props = Pick<RecordControlProps, 'enabled' | 'onClick'> & { isPaused: boolean };

export const PauseButton: FunctionComponent<Props> = ({ enabled, isPaused, onClick }: Props) => {
  const { t } = useTranslation();
  const icon = isPaused ? PlayIcon : PauseIcon;
  const title = isPaused ? t('window.recording.pauseButton.play.title') : t('window.recording.pauseButton.pause.title');
  return <ButtonControl title={title} onClick={onClick} Icon={icon} width='normal' enabled={enabled} />;
};
