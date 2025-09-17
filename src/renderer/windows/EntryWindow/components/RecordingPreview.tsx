import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { filesize } from 'filesize';
import { useTranslation } from 'react-i18next';
import { WebmVideo } from '_renderer/components';
import { RecordingData } from '_shared/types';

interface Props {
  duration: number;
  index: number;
  recording: RecordingData;
}

const useStyles = makeStyles()((theme) => ({
  root: {
    width: '100%',
    '&:not(:last-child)': {
      marginBottom: theme.spacing(3),
    },
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(0.5),
  },
  title: {
    fontWeight: 600,
  },
  player: {
    aspectRatio: '16/9',
    border: `1px solid ${theme.palette.grey['400']}`,
    height: 'auto',
    objectFit: 'cover',
    position: 'relative',
    width: '100%',
  },
  play: {
    borderRadius: '50%',
    color: theme.palette.grey['700'],
    cursor: 'pointer',
    fontSize: 60,
    left: '50%',
    opacity: 0.8,
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    zIndex: 1,
    '&:hover': {
      opacity: 1,
    },
  },
}));

export const RecordingPreview: FunctionComponent<Props> = ({ duration, index, recording }: Props) => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      <div className={classes.info}>
        <div className={classes.title}>
          {t('window.entry.recordingPreview.sourceTitle')} {index + 1}
        </div>
        <div>{filesize(recording.size) as string}</div>
      </div>
      <WebmVideo
        className={classes.player}
        controls
        disablePictureInPicture
        duration={duration}
        preload='auto'
        src={recording.filePath}
      />
    </div>
  );
};
