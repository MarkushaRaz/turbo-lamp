import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  window: {
    display: 'flex',
  },
  windowFrame: {
    height: 'auto',
    alignSelf: 'flex-end',
  },
}));
