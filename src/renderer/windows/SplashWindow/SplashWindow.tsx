import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { LinearProgress, Typography } from '@mui/material';
import { AppVersion, Grid, Window } from '_renderer/components';
import { useTranslation } from 'react-i18next';
import splashSvg from './assets/splash.svg';

const useStyles = makeStyles()((theme) => ({
  frame: {
    borderColor: theme.palette.primary.light,
  },
  splash: {
    width: '100%',
    height: 100,
    backgroundImage: `url(${splashSvg})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    marginBottom: 0,
  },
  appName: {
    fontWeight: 'bold',
    color: '#03093f',
  },
  progressBar: {
    height: 10,
    width: '100%',
  },
}));

export const SplashWindow: FunctionComponent = () => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  return (
    <Window frameProps={{ borderRadius: 4, classes: { root: classes.frame } }}>
      <Grid container fillHeight direction='column'>
        <Grid item container grow={1} direction='column' alignItems='center' justifyContent='flex-end'>
          <div className={classes.splash} />
        </Grid>
        <Grid item container direction='column' justifyContent='flex-end' basis={60}>
          <Grid item container grow={1} direction='column' alignItems='center' justifyContent='center'>
            <Typography variant='caption' className={classes.appName}>
              {t('app.name')} <AppVersion />
            </Typography>
            <Typography color='textSecondary' variant='caption'>
              {t('window.splash.updating')}
            </Typography>
          </Grid>
          <Grid item>
            <LinearProgress className={classes.progressBar} />
          </Grid>
        </Grid>
      </Grid>
    </Window>
  );
};
