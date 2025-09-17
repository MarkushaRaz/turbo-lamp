import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { keyframes } from 'tss-react';

interface Props {
  enabled: boolean;
  isPaused: boolean;
}

const useStyles = makeStyles<Props>()((theme, { enabled, isPaused }) => ({
  root: {
    width: '15px',
    height: '15px',
    backgroundColor: isPaused ? theme.palette.text.disabled : theme.palette.error.main,
    borderRadius: '50%',
    alignSelf: 'center',
    visibility: enabled ? 'visible' : 'hidden',
  },
  flicker: {
    animation: `${keyframes`
      from {
        opacity: 1;
      }
      to {
        opacity: 0.5;
      }
    `} 0.6s infinite alternate ease-out`,
  },
}));

export const StatusIndicator: FunctionComponent<Props> = ({ enabled, isPaused }: Props) => {
  const { classes } = useStyles({ enabled, isPaused });
  return <div className={`${isPaused ? '' : classes.flicker} ${classes.root}`} />;
};
