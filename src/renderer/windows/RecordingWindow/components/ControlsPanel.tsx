import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { PropsWithChildren } from '_renderer/types';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: '5px',
    paddingLeft: '15px',
    paddingTop: '5px',
    paddingBottom: '5px',
    borderTop: `1px solid ${theme.palette.grey['300']}`,
  },
}));

export const ControlsPanel: FunctionComponent<PropsWithChildren> = ({ children }: PropsWithChildren) => {
  const { classes } = useStyles();
  return <div className={classes.root}>{children}</div>;
};
