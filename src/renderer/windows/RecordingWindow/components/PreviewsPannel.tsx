import React, { FunctionComponent, HTMLAttributes } from 'react';
import { makeStyles } from 'tss-react/mui';

type Props = HTMLAttributes<HTMLDivElement>;

const useStyles = makeStyles()((theme) => ({
  root: {
    margin: theme.spacing(2, 0, 1),
  },
}));

export const PreviewsPannel: FunctionComponent<Props> = ({ className, children }: Props) => {
  const { classes, cx } = useStyles();

  return <div className={cx(classes.root, className)}>{children}</div>;
};
