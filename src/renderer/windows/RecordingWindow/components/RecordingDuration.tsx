import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import moment from 'moment';

interface Props {
  active: boolean;
  duration: number;
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

export const RecordingDuration: FunctionComponent<Props> = ({ active, duration }: Props) => {
  const { classes } = useStyles({ active });
  return <div className={classes.root}>{readableDuration(duration)}</div>;
};
