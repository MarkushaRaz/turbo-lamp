import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { Button } from '@mui/material';

interface Props {
  presetIndex: number;
  onClick?(presetIndex: number): void;
}

const useStyles = makeStyles<Pick<Props, 'presetIndex'>>()((theme, { presetIndex }) => ({
  root: {
    border: `1px solid ${theme.palette.grey['900']}`,
    borderBottomLeftRadius: [1, 3, 4].includes(presetIndex) ? 0 : 3,
    borderBottomRightRadius: [2, 3, 4].includes(presetIndex) ? 0 : 3,
    borderTopLeftRadius: [1, 2, 3].includes(presetIndex) ? 0 : 3,
    borderTopRightRadius: [1, 2, 4].includes(presetIndex) ? 0 : 3,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    height: 30,
    minWidth: 'unset',
    opacity: 0.5,
    transition: 'none',
    width: 30,
    '&:hover': {
      opacity: 1,
    },
  },
}));

export const PtzPresetButton: FunctionComponent<Props> = ({ presetIndex, onClick }: Props) => {
  const { classes } = useStyles({ presetIndex });

  const handleClick = () => {
    onClick?.(presetIndex);
  };

  return (
    <Button variant='contained' color='secondary' className={classes.root} size='small' onClick={handleClick}>
      {presetIndex}
    </Button>
  );
};

PtzPresetButton.defaultProps = {
  onClick: undefined,
};
