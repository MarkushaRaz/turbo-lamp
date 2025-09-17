import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { IconButton, Skeleton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';
import { Grid, GridSpacer } from '_renderer/components';
import { canEntryBeDeleted, canEntryBeViewed } from '_renderer/utils';
import { EntryData } from '_shared/types';
import log from 'electron-log';
import { EntryStatusText } from './EntryStatusText';
import { EntryDate } from './EntryDate';
import { EntryDuration } from './EntryDuration';

const logger = log.scope('EntryCard');

interface Props {
  entry: EntryData;
  onDelete?(entryId: number): void;
  onView?(entry: EntryData): void;
}

const useStyles = makeStyles()((theme) => ({
  root: {
    backgroundColor: theme.palette.grey['50'],
    border: `1px solid ${theme.palette.grey['300']}`,
    borderRadius: 5,
    marginBottom: theme.spacing(2),
  },
  thumbnail: {
    aspectRatio: '1.79',
    border: `1px solid ${theme.palette.grey['400']}`,
    height: 'auto',
  },
  name: {
    color: theme.palette.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  ellipsis: {
    display: '-webkit-box',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
  },
  deleteButton: {
    color: theme.palette.error.main,
  },
}));

export const EntryCard: FunctionComponent<Props> = ({ entry, onDelete, onView }: Props) => {
  const { classes, cx } = useStyles();
  const { t } = useTranslation();
  const videoSrc = entry.recordings?.[0]?.filePath ?? '';

  const canBeDeleted = canEntryBeDeleted(entry);
  const canBeViewed = canEntryBeViewed(entry);

  const handleDeleteClick = () => {
    logger.info(`Try delete ${entry.id} - ${entry.name}`);
    onDelete?.(entry.id);
  };

  const handleViewClick = () => {
    logger.info(`View ${entry.id} - ${entry.name}`);
    onView?.(entry);
  };

  return (
    <Grid container item shrink={0} className={classes.root} padding={1}>
      <Grid item basis={180} shrink={0}>
        {videoSrc ? (
          <video src={videoSrc} width='100%' height='auto' />
        ) : (
          <Skeleton width='100%' className={classes.thumbnail} variant='rectangular' />
        )}
      </Grid>
      <GridSpacer basis={10} transparent />
      <Grid container item direction='column' grow={1} justifyContent='space-between'>
        <Grid item className={cx(classes.name, classes.ellipsis)}>
          {entry.name}
        </Grid>
        <GridSpacer basis={4} transparent />
        <Grid container item justifyContent='space-between'>
          <Grid item>
            <EntryDate date={entry.startTime} />
          </Grid>
          <Grid item>
            <EntryDuration duration={entry.duration} />
          </Grid>
        </Grid>
        <GridSpacer basis={4} transparent />
        <Grid container item justifyContent='space-between' shrink={0}>
          <Grid item grow={1}>
            <EntryStatusText entry={entry} />
          </Grid>
          <Grid container item>
            {canBeDeleted && (
              <IconButton
                size='small'
                className={classes.deleteButton}
                title={t<string>('general.delete')}
                onClick={handleDeleteClick}
              >
                <DeleteForeverIcon />
              </IconButton>
            )}
            {canBeViewed && (
              <IconButton color='primary' size='small' title={t<string>('general.view')} onClick={handleViewClick}>
                <VisibilityIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

EntryCard.defaultProps = {
  onDelete: undefined,
  onView: undefined,
};
