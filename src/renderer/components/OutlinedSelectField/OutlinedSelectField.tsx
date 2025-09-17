import React, { FunctionComponent, ReactNode } from 'react';
import { makeStyles } from 'tss-react/mui';
import { BaseTextFieldProps, TextField as MuiTextField, TextFieldProps } from '@mui/material';

export type OutlinedSelectFieldProps = TextFieldProps & {
  boldLabel?: boolean;
  color?: BaseTextFieldProps['color'];
  options?: ReactNode;
  size?: BaseTextFieldProps['size'];
};

const useStyles = makeStyles<Pick<OutlinedSelectFieldProps, 'boldLabel'>>()((theme, { boldLabel }) => ({
  root: {
    margin: theme.spacing(0, 0, 3),
  },
  label: {
    color: theme.palette.grey['900'],
    fontWeight: boldLabel ? 'bold' : 'normal',
    marginBottom: theme.spacing(1),
    position: 'static',
  },
  shrink: {
    transform: 'none !important',
  },
}));

export const OutlinedSelectField: FunctionComponent<OutlinedSelectFieldProps> = ({
  boldLabel,
  color,
  variant,
  size,
  InputProps,
  InputLabelProps,
  options,
  ...props
}: OutlinedSelectFieldProps) => {
  const { classes } = useStyles({ boldLabel });

  return (
    <MuiTextField
      className={classes.root}
      color={color}
      size={size}
      select
      variant='outlined'
      InputProps={{ notched: false, ...InputProps }}
      InputLabelProps={{ shrink: true, classes: { root: classes.label, shrink: classes.shrink }, ...InputLabelProps }}
      {...props}
    >
      {options}
    </MuiTextField>
  );
};

OutlinedSelectField.defaultProps = {
  boldLabel: false,
  color: 'primary',
  options: undefined,
  size: 'small',
};
