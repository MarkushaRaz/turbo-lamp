import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { Theme } from '@mui/material/styles';
import { IconButton, lighten } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

export interface RecordControlProps {
  className?: string;
  enabled?: boolean;
  onClick?(): void;
  title: string;
  Icon: SvgIconComponent;
  width: 'normal' | 'small' | 'medium';
}

const useStyles = makeStyles<Pick<RecordControlProps, 'enabled'>>()((theme: Theme, { enabled }) => ({
  root: {
    color: enabled ? theme.palette.primary.light : lighten(theme.palette.primary.light, 0.5),
    padding: 0,
    cursor: 'pointer',
    '& svg': {
      fontSize: 35,
    },
    '&:hover': {
      backgroundColor: 'unset',
      color: theme.palette.primary.dark,
    },
  },
  normal: {
    width: '35px',
  },
  small: {
    alignSelf: 'flex-start',
    width: '20px',
    '& svg': {
      fontSize: 20,
    },
  },
  medium: {
    width: '30px',
    '& svg': {
      fontSize: 30,
    },
  },
}));

export const ButtonControl: FunctionComponent<RecordControlProps> = ({
  className,
  Icon,
  enabled,
  onClick,
  title,
  width,
}: RecordControlProps) => {
  const { classes } = useStyles({ enabled });

  return (
    <IconButton
      aria-label={title}
      title={title}
      className={`${classes.root} ${classes[width]} ${className}`}
      onClick={onClick}
      component='span'
      disableRipple
      disabled={!enabled}
      size='large'
    >
      <Icon className={`${classes.root} ${className}`} />
    </IconButton>
  );
};

ButtonControl.defaultProps = {
  enabled: true,
  onClick: undefined,
  className: '',
};
