import React, { FunctionComponent } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTranslation } from 'react-i18next';

type Props = ButtonProps;

const useStyles = makeStyles()(() => ({
  root: {
    textTransform: 'none',
  },
}));

export const DeleteButton: FunctionComponent<Props> = (props: Props) => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  return (
    <Button className={classes.root} variant='text' color='error' {...props}>
      {t('window.entry.deleteButton.text')}
    </Button>
  );
};
