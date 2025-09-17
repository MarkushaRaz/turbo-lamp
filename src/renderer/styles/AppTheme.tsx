import { createTheme } from '@mui/material/styles';
import { lighten } from '@mui/material';

const primaryColor = '#03093f';
const primaryHover = lighten(primaryColor, 0.1);
const secondaryColor = '#29D967';
const redColor = '#c40707';

export const AppTheme = createTheme({
  palette: {
    background: {
      default: 'transparent',
    },
    error: {
      main: redColor,
    },
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          transition:
            'background-color 250ms cubic-bezier(0.4,0,0.2,1) 0ms,' +
            'box-shadow 250ms cubic-bezier(0.4,0,0.2,1) 0ms,' +
            'border-color 250ms cubic-bezier(0.4,0,0.2,1) 0ms,' +
            'color 250ms cubic-bezier(0.4,0,0.2,1) 0ms,' +
            'filter 250ms cubic-bezier(0.4,0,0.2,1) 0ms',
          '&:hover': {
            backgroundColor: primaryHover,
            filter: 'saturate(2)',
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: redColor,
        },
      },
    },
  },
});
