import { Accordion } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const SettingsAccordion = withStyles(Accordion, (theme, _, classes) => ({
  root: {
    border: `1px solid ${theme.palette.grey['300']}`,
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    [`&.${classes.expanded}`]: {
      margin: 0,
    },
  },
}));
