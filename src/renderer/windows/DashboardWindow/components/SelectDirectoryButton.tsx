import React, { FunctionComponent } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = Pick<ButtonProps, 'onClick' | 'className'>;

export const SelectDirectoryButton: FunctionComponent<Props> = ({ onClick, className }: Props) => {
  const { t } = useTranslation();

  return (
    <Button color='primary' variant='outlined' onClick={onClick} disableElevation className={className}>
      {t('general.selectDirectory')}
    </Button>
  );
};
