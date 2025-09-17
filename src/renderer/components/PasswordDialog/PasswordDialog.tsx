import React, { ChangeEvent, FunctionComponent, KeyboardEvent, useContext, useEffect, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import log from 'electron-log';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { OutlinedTextField } from '../OutlinedTextField';
import { WindowFrameContext } from '../Window';

const logger = log.scope('PasswordDialog');

interface Props {
  onClose(): void;
  onPasswordChange?(value: string): void;
  onSubmit(password: string): void;
  open: boolean;
  passwordInvalid?: boolean;
  showTitle?: boolean;
  text?: string;
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
  text: {
    marginBottom: theme.spacing(1),
  },
  error: {
    color: theme.palette.error.main,
  },
}));

export const PasswordDialog: FunctionComponent<Props> = ({
  onClose,
  onPasswordChange,
  onSubmit,
  open,
  passwordInvalid,
  showTitle,
  text,
  title,
}: Props) => {
  const { borderRadius } = useContext(WindowFrameContext);
  const { classes } = useStyles({ borderRadius });
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    logger.info(`Show password: ${!showPassword}`);
    return setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const handleSubmit = () => onSubmit(password);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setPassword(event.target.value);

    if (onPasswordChange) {
      onPasswordChange(event.target.value);
    }
  };

  useEffect(() => {
    if (open) return;

    setShowPassword(false);

    if (!passwordInvalid) {
      setPassword('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog
      BackdropProps={{ classes: { root: classes.root } }}
      aria-describedby='password-dialog-description'
      aria-labelledby='password-dialog-title'
      onClose={onClose}
      open={open}
    >
      {showTitle && (
        <DialogTitle id='password-dialog-title'>{title || t('window.entry.passwordDialog.title')}</DialogTitle>
      )}
      <DialogContent>
        {text && <DialogContentText className={classes.text}>{text}</DialogContentText>}
        <OutlinedTextField
          autoFocus
          type={showPassword ? 'text' : 'password'}
          fullWidth
          value={password}
          error={passwordInvalid}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='inherit'>
          {t('general.cancel')}
        </Button>
        <Button onClick={handleSubmit} color='primary' disabled={!password.length}>
          {t('general.ok')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PasswordDialog.defaultProps = {
  onPasswordChange: undefined,
  passwordInvalid: false,
  showTitle: true,
  text: undefined,
  title: undefined,
};
