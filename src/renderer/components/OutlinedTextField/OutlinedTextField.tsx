import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { BaseTextFieldProps, TextField as MuiTextField, TextFieldProps } from '@mui/material';

export type OutlinedTextFieldProps = TextFieldProps & {
  boldLabel?: boolean;
  color?: BaseTextFieldProps['color'];
  size?: BaseTextFieldProps['size'];
};

const useStyles = makeStyles<Pick<OutlinedTextFieldProps, 'boldLabel'>>()((theme, { boldLabel }) => ({
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

export const OutlinedTextField: FunctionComponent<OutlinedTextFieldProps> = ({
  boldLabel,
  color,
  variant,
  size,
  InputProps,
  InputLabelProps,
  ...props
}: OutlinedTextFieldProps) => {
  const { classes } = useStyles({ boldLabel });

  return (
    <MuiTextField
      className={classes.root}
      color={color}
      size={size}
      variant='outlined'
      InputProps={{ notched: false, ...InputProps }}
      InputLabelProps={{ shrink: true, classes: { root: classes.label, shrink: classes.shrink }, ...InputLabelProps }}
      {...props}
    />
  );
};

OutlinedTextField.defaultProps = {
  boldLabel: false,
  color: 'primary',
  size: 'small',
};
