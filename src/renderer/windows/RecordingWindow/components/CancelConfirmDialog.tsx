import React, { FunctionComponent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { Button, Container, Typography } from '@mui/material';
import { WindowFrameContext } from '_/renderer/components/Window';

interface Props {
  onClose(): void;
  onConfirm(): void;
  isScheduledRecording?: boolean;
}

type StyleProps = {
  borderRadius: number;
};

const useStyles = makeStyles<StyleProps>()((_theme, { borderRadius }) => ({
  root: {
    borderRadius,
    padding: '10px 15px',
  },
  buttons: {
    padding: 0,
    marginTop: '5px',
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

export const CancelConfirmDialog: FunctionComponent<Props> = ({ onClose, onConfirm, isScheduledRecording }: Props) => {
  const { borderRadius } = useContext(WindowFrameContext);
  const { classes } = useStyles({ borderRadius });
  const { t } = useTranslation();

  return (
    <Container className={classes.root}>
      <Typography>
        {isScheduledRecording
          ? t('window.recording.cancelConfirmDialog.content.scheduled')
          : t('window.recording.cancelConfirmDialog.content.manual')}
      </Typography>
      <Container className={classes.buttons}>
        <Button onClick={onConfirm} color='error'>
          {t('window.recording.cancelConfirmDialog.buttons.confirm')}
        </Button>
        <Button onClick={onClose}>{t('window.recording.cancelConfirmDialog.buttons.refuse')}</Button>
      </Container>
    </Container>
  );
};

CancelConfirmDialog.defaultProps = {
  isScheduledRecording: false,
};
