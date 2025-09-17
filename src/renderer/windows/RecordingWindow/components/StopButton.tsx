import React, { FunctionComponent } from 'react';
import StopIcon from '@mui/icons-material/Stop';
import { useTranslation } from 'react-i18next';
import { ButtonControl, RecordControlProps } from './ButtonControl';

type Props = Pick<RecordControlProps, 'enabled' | 'onClick'>;

export const StopButton: FunctionComponent<Props> = ({ enabled, onClick }: Props) => {
  const { t } = useTranslation();
  return (
    <ButtonControl
      title={t('window.recording.stopButton.title')}
      onClick={onClick}
      Icon={StopIcon}
      width='normal'
      enabled={enabled}
    />
  );
};
