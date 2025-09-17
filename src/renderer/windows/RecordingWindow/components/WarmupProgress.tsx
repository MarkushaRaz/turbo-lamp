import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { LinearProgress } from '@mui/material';

interface Props {
  progress: number;
}

const useStyles = makeStyles()(() => ({
  root: {
    position: 'absolute',
    height: 4,
    left: 0,
    right: 0,
    top: -2,
  },
}));

export const WarmupProgress: FunctionComponent<Props> = ({ progress }: Props) => {
  const { classes } = useStyles();

  return <LinearProgress variant='determinate' color='primary' value={progress} className={classes.root} />;
};
