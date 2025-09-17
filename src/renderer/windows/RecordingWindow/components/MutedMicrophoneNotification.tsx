import React, { FunctionComponent, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { Container, Typography, lighten } from '@mui/material';
import { WindowFrameContext } from '_/renderer/components/Window';
import { CaptureSource } from '_/shared/types';
import { WarningAmberOutlined as WarningIcon } from '@mui/icons-material';
import { keyframes } from 'tss-react';

const ANALYSER_SMOOTHING = 0.7;
const ANALYSER_FFT_SIZE = 1024;
const ANALYSER_PROCESS_FREQUENCY = 200;
const ANALYSER_THRESHOLD = 0.05;
const NOTIFICATION_DISPLAY_TIMEOUT = 2000;

interface Props {
  source?: CaptureSource;
  muted?: boolean;
  roundTopCorners?: boolean;
}

type StyleProps = {
  borderRadius: number;
};

const useStyles = makeStyles<StyleProps>()((theme, { borderRadius }) => ({
  root: {
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    borderWidth: '3px',
    borderColor: theme.palette.warning.light,
    borderStyle: 'solid',
    padding: '10px 5px',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: lighten(theme.palette.warning.light, 0.9),
  },
  text: {
    color: theme.palette.warning.light,
    marginLeft: '5px',
  },
  icon: {
    color: theme.palette.warning.light,
    animation: `${keyframes`
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    `} 0.4s infinite alternate ease-out`,
  },
}));

const createAnalyser = (): [AudioContext, AnalyserNode] => {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  analyser.smoothingTimeConstant = ANALYSER_SMOOTHING;
  analyser.fftSize = ANALYSER_FFT_SIZE;
  return [audioContext, analyser];
};

export const MutedMicrophoneNotification: FunctionComponent<Props> = ({ source, muted, roundTopCorners }: Props) => {
  let { borderRadius } = useContext(WindowFrameContext);
  if (!roundTopCorners) borderRadius = 0;
  const { classes } = useStyles({ borderRadius });
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [audioDeviceChanged, setAudioDeviceChanged] = useState(true);
  const [audioContext, analyser] = useMemo(createAnalyser, [source]);

  useEffect(() => {
    const handler = () => {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const deviceAttached = devices.some(
            (d) => d.kind === 'audioinput' && d.deviceId === source?.deviceId && d.label === source?.deviceName,
          );
          setAudioDeviceChanged(deviceAttached);
        })
        .catch(() => {});
    };
    navigator.mediaDevices.addEventListener('devicechange', handler);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handler);
    };
  }, [source]);

  useEffect(() => {
    setInitialized(false);
    navigator.mediaDevices
      .getUserMedia({
        audio: { deviceId: source?.deviceId ?? '' },
      })
      .then((stream) => {
        const destination = audioContext.createMediaStreamSource(stream);
        destination.connect(analyser);
        setInitialized(true);
      })
      .catch(() => {
        setInitialized(false);
      });
    return () => {
      if (initialized) {
        analyser.disconnect();
        setInitialized(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, audioDeviceChanged]);

  useEffect(() => {
    if (!initialized) return () => {};
    let timer: NodeJS.Timer | null = null;
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    const interval = setInterval(() => {
      analyser.getByteFrequencyData(frequencyData);
      if (timer) return;
      const sum = frequencyData.reduce((previous, current) => previous + current, 0);
      const normalized = sum / frequencyData.length / 255;
      const doOpen = normalized > ANALYSER_THRESHOLD;
      setOpen(doOpen);
      if (doOpen) {
        timer = setTimeout(() => {
          timer = null;
        }, NOTIFICATION_DISPLAY_TIMEOUT);
      }
    }, ANALYSER_PROCESS_FREQUENCY);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  return (
    <div>
      {open && muted && (
        <Container className={classes.root}>
          <WarningIcon className={classes.icon} />
          <Typography className={classes.text}>{t('window.recording.mutedMicrophoneNotification.text')}</Typography>
        </Container>
      )}
    </div>
  );
};

MutedMicrophoneNotification.defaultProps = {
  source: undefined,
  muted: undefined,
  roundTopCorners: undefined,
};
