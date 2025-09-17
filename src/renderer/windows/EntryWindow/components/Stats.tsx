import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { filesize } from 'filesize';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface Props {
  duration: number;
  totalSize: number;
}

const useStyles = makeStyles()(() => ({
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    lineHeight: 2,
  },
  value: {
    fontWeight: 600,
  },
}));

const readableDuration = (seconds: number) => moment.duration(seconds, 'seconds').format('H:mm:ss', { trim: false });

export const Stats: FunctionComponent<Props> = ({ duration, totalSize }: Props) => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  return (
    <div>
      <div className={classes.row}>
        <span>{t('general.duration')}:</span>
        <span className={classes.value}>{readableDuration(duration)}</span>
      </div>
      <div className={classes.row}>
        <span>{t('general.totalSize')}:</span>
        <span className={classes.value}>{filesize(totalSize) as string}</span>
      </div>
    </div>
  );
};
