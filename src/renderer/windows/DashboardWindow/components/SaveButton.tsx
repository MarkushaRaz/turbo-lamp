import React, { FunctionComponent } from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props extends Pick<ButtonProps, 'disabled' | 'onClick'> {
  loading?: boolean;
}

export const SaveButton: FunctionComponent<Props> = ({ disabled, onClick, loading = false }: Props) => {
  const { t } = useTranslation();

  return (
    <Button
      color='primary'
      variant='contained'
      disabled={disabled || loading}
      onClick={onClick}
      disableElevation
      startIcon={loading ? <CircularProgress size={15} color='inherit' /> : undefined}
    >
      {t('general.save')}
    </Button>
  );
};

SaveButton.defaultProps = {
  loading: false,
};
