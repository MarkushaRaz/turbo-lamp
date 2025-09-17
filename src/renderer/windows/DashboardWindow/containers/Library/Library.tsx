import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { ConfirmDialog, Grid, GridSpacer } from '_renderer/components';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, Typography } from '@mui/material';

import { duration } from 'moment';
import {
  deleteEntryAction,
  getLibraryEntriesAction,
  setLibraryPageAction,
  switchToEntryWindowAction,
} from '_shared/actions';
import { EntryWindowMode } from '_shared/enums';
import { makeSelectLibraryState } from '_shared/selectors';
import { EntryData } from '_shared/types';
import log from 'electron-log';
import { EntryCard } from '../../components';

const logger = log.scope('Library');

const PAGE_SIZE = 3;
const REFRESH_INTERVAL = duration(5, 'seconds').asMilliseconds();

export const Library: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { entries, error, loading, page, totalCount } = useSelector(makeSelectLibraryState());
  const [pagesCount, setPagesCount] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [entryIdToDelete, setEntryIdToDelete] = useState(0);

  useEffect(() => {
    const refresh = () => {
      dispatch(getLibraryEntriesAction(PAGE_SIZE, page));
      return refresh;
    };

    const interval = setInterval(refresh(), REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [page, dispatch]);

  useEffect(() => {
    setPagesCount(Math.ceil(totalCount / PAGE_SIZE));
  }, [totalCount]);

  const openDialog = (entryId: number) => {
    logger.info(`Open confirme delete dialog`);
    setEntryIdToDelete(entryId);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    logger.info(`Close confirme delete dialog`);
    setDialogOpen(false);
  };

  const handlePageChange = (_: ChangeEvent<unknown>, newPage: number) => {
    logger.info(`Next page: ${newPage}`);
    dispatch(setLibraryPageAction(newPage));
  };

  const handleDeleteClick = () => {
    setDialogOpen(false);
    if (!entryIdToDelete) return;
    setEntryIdToDelete(0);
    logger.info(`Delete entry ${entryIdToDelete}`);
    dispatch(deleteEntryAction(entryIdToDelete));
    setTimeout(() => dispatch(getLibraryEntriesAction(PAGE_SIZE, page)), 100);
  };

  const handleViewClick = (entry: EntryData) => {
    logger.info(`Open view for entry: ${entry.id} - ${entry.name}`);
    dispatch(switchToEntryWindowAction(entry, EntryWindowMode.View));
  };

  return (
    <>
      <Helmet title={t<string>('window.dashboard.library.windowTitle')} />
      <Grid container direction='column' item grow={1} padded scrollY>
        {loading && !entries.length && <Typography>{t('window.dashboard.library.loading')}</Typography>}
        {!loading && error && <Typography color='error'>{t('window.dashboard.library.loadingError')}</Typography>}
        {!error &&
          (entries.length
            ? entries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} onDelete={openDialog} onView={handleViewClick} />
              ))
            : t('window.dashboard.library.noEntriesFound'))}
      </Grid>
      <GridSpacer horizontalBorders />
      <Grid container item padded justifyContent='center' shrink={0}>
        <Pagination
          count={pagesCount}
          defaultPage={1}
          onChange={handlePageChange}
          page={page}
          showFirstButton
          showLastButton
        />
      </Grid>
      <ConfirmDialog
        content={t('window.dashboard.library.deleteDialogContent')}
        onClose={closeDialog}
        onConfirm={handleDeleteClick}
        open={dialogOpen}
        positiveButtonColor='error'
      />
    </>
  );
};
