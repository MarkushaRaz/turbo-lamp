import React, { FunctionComponent, ReactNode, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { WindowFrameContext } from '../Window';

type ButtonColor = 'inherit' | 'primary' | 'secondary' | 'success' | 'error';

interface Props {
  content: string | ReactNode;
  buttonColor?: ButtonColor;
  buttonText?: string;
  onClose(): void;
  open: boolean;
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

export const AlertDialog: FunctionComponent<Props> = ({
  content,
  buttonColor,
  buttonText,
  onClose,
  open,
  title,
}: Props) => {
  const { borderRadius } = useContext(WindowFrameContext);
  const { classes } = useStyles({ borderRadius });
  const { t } = useTranslation();

  return (
    <Dialog
      BackdropProps={{ classes: { root: classes.root } }}
      aria-describedby='alert-dialog-description'
      aria-labelledby='alert-dialog-title'
      onClose={onClose}
      open={open}
    >
      {title && <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color={buttonColor}>
          {buttonText || t('general.ok')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AlertDialog.defaultProps = {
  buttonColor: 'inherit',
  buttonText: undefined,
  title: undefined,
};
