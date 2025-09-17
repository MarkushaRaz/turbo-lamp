import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { Grid } from '_renderer/components';
import { PtzPresetButton } from '_renderer/windows/RecordingWindow/components/PtzPresetButton';

interface Props {
  onPresetRecall(presetIndex: number): void;
}

const useStyles = makeStyles()(() => ({
  root: {
    bottom: 6,
    left: -1,
    position: 'absolute',
    right: -1,
    top: -1,
    zIndex: 100,
  },
  button: {
    opacity: 0.4,
    '&:hover': {
      opacity: 1,
    },
    '&:first-child': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
  },
}));

export const PtzCameraPresetControls: FunctionComponent<Props> = ({ onPresetRecall }: Props) => {
  const { classes } = useStyles();

  return (
    <Grid container direction='column' justifyContent='space-between' className={classes.root}>
      <Grid container item justifyContent='space-between'>
        {[1, 2].map((value) => (
          <PtzPresetButton key={value} presetIndex={value} onClick={onPresetRecall} />
        ))}
      </Grid>
      <Grid container item justifyContent='space-between'>
        {[3, 4].map((value) => (
          <PtzPresetButton key={value} presetIndex={value} onClick={onPresetRecall} />
        ))}
      </Grid>
    </Grid>
  );
};
