import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useTranslation } from 'react-i18next';
import { AppRegion } from '_renderer/components';
import ScheduleIcon from '@mui/icons-material/Schedule';

interface Props {
  padding?: number;
}

const useStyles = makeStyles<Pick<Props, 'padding'>>()((theme, { padding }) => ({
  root: {
    aspectRatio: '1/1',
    height: '100%',
    padding,
  },
  icon: {
    color: theme.palette.secondary.main,
    height: '100%',
    pointerEvents: 'none',
    transition: 'all 0.3s ease-in-out',
    width: '100%',
  },
}));

export const ScheduleEnabledIcon: FunctionComponent<Props> = ({ padding }: Props) => {
  const { classes } = useStyles({ padding });
  const { t } = useTranslation();

  return (
    <AppRegion className={classes.root} title={t<string>('window.main.scheduleEnabledIcon.title')} drag>
      <ScheduleIcon className={classes.icon} />
    </AppRegion>
  );
};

ScheduleEnabledIcon.defaultProps = {
  padding: 6,
};
