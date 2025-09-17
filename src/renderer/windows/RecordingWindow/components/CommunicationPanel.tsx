import React, { FunctionComponent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { Typography, darken } from '@mui/material';
import { WindowFrameContext } from '_/renderer/components/Window';
import { CellTowerOutlined as Icon } from '@mui/icons-material';
import { keyframes } from 'tss-react';
import { ipcRenderer } from 'electron';
import { useSelector } from 'react-redux';
import { recordingWindowStateSelector } from '../state';

interface Props {
  roundTopCorners: boolean;
}

type StyleProps = {
  borderRadius: number;
};

const useStyles = makeStyles<StyleProps>()((theme, { borderRadius }) => ({
  root: {
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    borderColor: theme.palette.common.black,
    padding: '5px',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: darken(theme.palette.background.paper, 0.1),
    },
  },
  text: {
    color: theme.palette.common.black,
    marginLeft: '5px',
  },
  icon: {
    color: theme.palette.error.light,
    animation: `${keyframes`
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    `} 0.6s infinite alternate ease-out`,
  },
}));

const toggleConferenceWindow = (): void => {
  ipcRenderer.send('changing-display', 'ToggleMinMaximize');
};

export const CommunicationPanel: FunctionComponent<Props> = ({ roundTopCorners }: Props) => {
  let { borderRadius } = useContext(WindowFrameContext);
  if (!roundTopCorners) borderRadius = 0;
  const { classes } = useStyles({ borderRadius });
  const { t } = useTranslation();
  const { aktruMeetIsBroadcasting } = useSelector(recordingWindowStateSelector);

  return (
    <div>
      {aktruMeetIsBroadcasting && (
        <div className={classes.root} onClick={toggleConferenceWindow}>
          <Icon className={classes.icon} />
          <Typography className={classes.text}>{t('window.recording.CommunicationPanel.text')}</Typography>
        </div>
      )}
    </div>
  );
};
