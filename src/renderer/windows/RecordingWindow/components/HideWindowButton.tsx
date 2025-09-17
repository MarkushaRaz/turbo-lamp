import React, { FunctionComponent } from 'react';
import MaximizeIcon from '@mui/icons-material/Maximize';
import { useTranslation } from 'react-i18next';
import { ButtonControl, RecordControlProps } from './ButtonControl';

type Props = Pick<RecordControlProps, 'onClick'>;

export const HideWindowButton: FunctionComponent<Props> = ({ onClick }: Props) => {
  const { t } = useTranslation();
  return (
    <ButtonControl title={t('window.recording.hideButton.title')} onClick={onClick} Icon={MaximizeIcon} width='small' />
  );
};
