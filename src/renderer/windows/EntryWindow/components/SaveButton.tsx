import React, { FunctionComponent } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = ButtonProps;

export const SaveButton: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Button variant='contained' color='primary' disableElevation {...props}>
      {t('window.entry.saveButton.text')}
    </Button>
  );
};
