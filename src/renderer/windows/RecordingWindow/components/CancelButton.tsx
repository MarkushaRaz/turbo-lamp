import React, { FunctionComponent } from 'react';
import CloseIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useTranslation } from 'react-i18next';
import { ButtonControl, RecordControlProps } from './ButtonControl';

type Props = Pick<RecordControlProps, 'onClick'>;

export const CancelButton: FunctionComponent<Props> = ({ onClick }: Props) => {
  const { t } = useTranslation();
  return (
    <ButtonControl title={t('window.recording.cancelButton.title')} onClick={onClick} Icon={CloseIcon} width='medium' />
  );
};
