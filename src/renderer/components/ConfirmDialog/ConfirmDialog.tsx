import React, { FunctionComponent, ReactNode, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { WindowFrameContext } from '../Window';

type ButtonColor = 'inherit' | 'primary' | 'secondary' | 'success' | 'error';

interface Props {
  content: string | ReactNode;
  negativeButtonColor?: ButtonColor;
  negativeButtonText?: string;
  onClose(): void;
  onConfirm(): void;
  open: boolean;
  positiveButtonColor?: ButtonColor;
  positiveButtonText?: string;
  title?: string;
}

type StyleProps = {
  borderRadius: number;
};

const useStyles = makeStyles<StyleProps>()((theme, { borderRadius }) => ({
  root: {
    borderRadius,
    margin: theme.spacing(1),
  },
}));

export const ConfirmDialog: FunctionComponent<Props> = ({
  content,
  negativeButtonColor,
  negativeButtonText,
  onClose,
  onConfirm,
  open,
  positiveButtonColor,
  positiveButtonText,
  title,
}: Props) => {
  const { borderRadius } = useContext(WindowFrameContext);
  const { classes } = useStyles({ borderRadius });
  const { t } = useTranslation();

  return (
    <Dialog
      BackdropProps={{ classes: { root: classes.root } }}
      aria-describedby='confirm-dialog-description'
      aria-labelledby='confirm-dialog-title'
      onClose={onClose}
      open={open}
    >
      <DialogTitle id='confirm-dialog-title'>{title || t('window.entry.confirmDialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText id='confirm-dialog-description'>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color={positiveButtonColor}>
          {positiveButtonText || t('general.yes')}
        </Button>
        <Button onClick={onClose} color={negativeButtonColor}>
          {negativeButtonText || t('general.no')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.defaultProps = {
  negativeButtonColor: 'inherit',
  negativeButtonText: undefined,
  positiveButtonColor: 'inherit',
  positiveButtonText: undefined,
  title: undefined,
};
