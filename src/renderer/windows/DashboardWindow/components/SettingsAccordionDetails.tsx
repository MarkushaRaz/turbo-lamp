import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { AccordionDetails } from '@mui/material';
import { Grid } from '_renderer/components';
import { PropsWithChildren } from '_renderer/types';

const useStyles = makeStyles()((theme) => ({
  root: {
    borderTop: `1px solid ${theme.palette.grey['300']}`,
    paddingTop: theme.spacing(2),
  },
}));

export const SettingsAccordionDetails: FunctionComponent<PropsWithChildren> = ({ children }: PropsWithChildren) => {
  const { classes } = useStyles();

  return (
    <AccordionDetails className={classes.root}>
      <Grid container direction='column' item grow={1}>
        {children}
      </Grid>
    </AccordionDetails>
  );
};
