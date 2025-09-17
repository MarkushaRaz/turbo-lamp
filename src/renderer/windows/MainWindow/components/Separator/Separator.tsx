import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';

interface Props {
  height?: string | number;
}

const useStyles = makeStyles<Props>()((theme, { height }) => ({
  root: {
    height,
    background: theme.palette.grey['400'],
    width: 1,
  },
}));

export const Separator: FunctionComponent<Props> = ({ height }: Props) => {
  const { classes } = useStyles({ height });
  return <div className={classes.root} />;
};

Separator.defaultProps = {
  height: '75%',
};
