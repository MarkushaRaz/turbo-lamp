import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PropsWithChildren } from '_renderer/types';

type Props = PropsWithChildren & {
  id: string;
  error?: boolean;
};

const useStyles = makeStyles<Pick<Props, 'error'>>()((theme, { error }) => ({
  content: {
    color: error ? theme.palette.error.main : theme.palette.grey['700'],
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    '&.Mui-expanded': {
      color: theme.palette.text.primary,
    },
  },
}));

export const SettingsAccordionSummary: FunctionComponent<Props> = ({ children, error, id }: Props) => {
  const { classes } = useStyles({ error });

  return (
    <AccordionSummary id={id} classes={{ content: classes.content }} expandIcon={<ExpandMoreIcon />}>
      {children}
    </AccordionSummary>
  );
};

SettingsAccordionSummary.defaultProps = {
  error: false,
};
