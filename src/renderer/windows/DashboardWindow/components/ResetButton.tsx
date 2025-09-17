import React, { FunctionComponent } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = Pick<ButtonProps, 'disabled' | 'onClick'>;

export const ResetButton: FunctionComponent<Props> = ({ disabled, onClick }: Props) => {
  const { t } = useTranslation();

  return (
    <Button disabled={disabled} onClick={onClick}>
      {t('general.reset')}
    </Button>
  );
};
