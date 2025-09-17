import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { AppRegion } from '_renderer/components';
import { PropsWithChildren } from '_/renderer/types';

const FRAME_HEIGHT = 90;
const PANEL_LEFT_RADIUS = FRAME_HEIGHT / 2;

const useStyles = makeStyles()((theme) => ({
  root: {
    height: FRAME_HEIGHT,
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(250,250,255,0.95)',
    borderColor: theme.palette.primary.light,
    borderStyle: 'solid',
    borderWidth: '1px',
    borderTopLeftRadius: PANEL_LEFT_RADIUS,
    borderBottomLeftRadius: PANEL_LEFT_RADIUS,
    boxShadow: '0 0 8px 1px rgba(0, 0, 0, 0.30)',
    paddingRight: theme.spacing(1),
  },
}));

export const WindowFrame: FunctionComponent<PropsWithChildren> = ({ children }: PropsWithChildren) => {
  const { classes } = useStyles();

  return (
    <AppRegion drag className={classes.root}>
      {children}
    </AppRegion>
  );
};
