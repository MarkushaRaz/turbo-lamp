import React, { FunctionComponent, useEffect, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import moment from 'moment';

interface Props {
  active: boolean;
  stopTime: Date;
}

const useStyles = makeStyles<Pick<Props, 'active'>>()((theme, { active }) => ({
  root: {
    textAlign: 'center',
    fontSize: '25px',
    alignSelf: 'center',
    marginLeft: '5px',
    color: active ? theme.palette.text.primary : theme.palette.text.disabled,
  },
}));

const readableDuration = (seconds: number) => moment.duration(seconds, 'seconds').format('HH:mm:ss', { trim: false });

const calculateRemainingSeconds = (stopTime: Date) => moment(stopTime).diff(moment(), 'seconds');

export const Countdown: FunctionComponent<Props> = ({ active, stopTime }: Props) => {
  const { classes } = useStyles({ active });
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    if (!active) return () => {};

    const interval = setInterval(() => {
      let seconds = calculateRemainingSeconds(stopTime);
      if (seconds < 0) seconds = 0;
      setSecondsRemaining(seconds);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [active, stopTime]);

  return <div className={classes.root}>{readableDuration(secondsRemaining)}</div>;
};
