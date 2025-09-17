import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmDialog, Grid, GridSpacer, Window } from '_renderer/components';
import { RecordingPreview } from '_renderer/windows/EntryWindow/components/RecordingPreview';
import { Entitlement, EntryStatus, EntryWindowMode, UploadStatus, WindowRoute } from '_shared/enums';
import { pick } from 'lodash';
import log from 'electron-log';
import {
  deleteEntryAction,
  minimizeWindowAction,
  resetEntryWindowStateAction,
  resetRecordingStateAction,
  switchToWindowAction,
  updateRecordingEntryAction,
} from '_shared/actions';
import { EntryData } from '_shared/types';
import { makeSelectEntryWindowState } from '_shared/selectors';
import { canEntryBeDeleted } from '_renderer/utils';
import { useBeforeUnload, useEntitlement } from '_renderer/hooks';
import {
  DeleteButton,
  EducationalMetadataFields,
  EntryDescriptionField,
  EntryNameField,
  EntryTagsField,
  SaveButton,
  Stats,
} from './components';
import { EntryMetadata } from './types';

const logger = log.scope('EntryWindow');

function calculateTotalSize(entry: EntryData) {
  const size = entry.recordings.reduce<number>((previousValue, currentValue) => previousValue + currentValue.size, 0);
  logger.info(`Entry ${entry.id} - ${entry.name} size is ${size} bytes`);
  return size;
}

const entryMetadataInitialState: EntryMetadata = {
  name: '',
  tags: '',
  description: '',
  teacher: '',
  email: '',
  subject: '',
  faculties: '',
  groups: '',
  type: '',
  year: '',
};

export const EntryWindow: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const hasEducationalMetadata = useEntitlement(Entitlement.HasEducationalMetadata);

  const [entryMetadata, setEntryMetadata] = useState<EntryMetadata>(entryMetadataInitialState);
  const [totalSize, setTotalSize] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [canBeDeleted, setCanBeDeleted] = useState(false);

  const { entry, mode } = useSelector(makeSelectEntryWindowState());

  const readOnly = mode === EntryWindowMode.View;
  const title = readOnly ? t('window.entry.title.viewEntry') : t('window.entry.title.saveEntry');

  useEffect(() => {
    if (entry) {
      setEntryMetadata(
        pick(entry, [
          'name',
          'tags',
          'description',
          'teacher',
          'email',
          'subject',
          'faculties',
          'groups',
          'type',
          'year',
        ]),
      );
      setTotalSize(calculateTotalSize(entry));
      setCanBeDeleted(canEntryBeDeleted(entry));
    } else {
      dispatch(switchToWindowAction(WindowRoute.MainWindow));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useBeforeUnload(() => {
    dispatch(resetEntryWindowStateAction());
  });

  const handleDelete = () => {
    if (entry) {
      logger.info(`Trying to delete entry: ${entry.id}`);
      dispatch(deleteEntryAction(entry.id));
    }
    dispatch(resetRecordingStateAction());
    dispatch(switchToWindowAction(readOnly ? WindowRoute.DashboardWindow : WindowRoute.MainWindow));
  };

  const handleSave = () => {
    logger.info('Trying to save entry');
    if (entry) {
      const recordings = entry.recordings.map((data) => ({
        ...data,
        uploadStatus: UploadStatus.ReadyToUpload,
      }));

      dispatch(
        updateRecordingEntryAction({
          ...entry,
          ...entryMetadata,
          recordings,
          status: EntryStatus.ReadyToUpload,
        }),
      );
      dispatch(resetRecordingStateAction());
      logger.info('Entry save successfully');
    }
    dispatch(switchToWindowAction(WindowRoute.MainWindow));
  };

  const handleMetadataChange = (stateSlice: Partial<EntryMetadata>) => {
    logger.info('Entry metafata changed', JSON.stringify(stateSlice));
    setEntryMetadata({ ...entryMetadata, ...stateSlice });
  };

  const openDialog = () => {
    logger.info('Open delete dialog');
    setDialogOpen(true);
  };

  const closeDialog = () => {
    logger.info('Close delete dialog');
    setDialogOpen(false);
  };

  const minimizeWindow = () => {
    logger.info('Minimize entry window');
    dispatch(minimizeWindowAction());
  };

  const switchToDashboardWindow = () => {
    logger.info('Close entry window and switch to dasboard window');
    dispatch(switchToWindowAction(WindowRoute.DashboardWindow));
  };

  return (
    <Window
      showStatusBar
      showTitleBar
      showControls={readOnly}
      controlsProps={{ onMinimizeClick: minimizeWindow, onCloseClick: switchToDashboardWindow }}
    >
      <Helmet title={title} />
      {entry && (
        <Grid container fillHeight>
          <Grid container item fillHeight paper direction='column' justifyContent='space-between' basis={280}>
            <Grid container item padded direction='column'>
              {entry.recordings.map((recording, index) => (
                <RecordingPreview key={recording.id} index={index} recording={recording} duration={entry?.duration} />
              ))}
            </Grid>
            <GridSpacer horizontalBorders />
            <Grid container item padded direction='column'>
              <Stats duration={entry.duration} totalSize={totalSize} />
            </Grid>
          </Grid>
          <GridSpacer verticalBorders />
          <Grid container item fillHeight paper direction='column' grow={1}>
            <Grid container item direction='column' grow={1} padded scroll>
              <EntryNameField
                disabled={readOnly}
                onChange={({ target: { value } }) => handleMetadataChange({ name: value })}
                value={entryMetadata.name}
              />
              <EntryTagsField
                disabled={readOnly}
                onChange={({ target: { value } }) => handleMetadataChange({ tags: value })}
                value={entryMetadata.tags}
              />
              <EntryDescriptionField
                disabled={readOnly}
                onChange={({ target: { value } }) => handleMetadataChange({ description: value })}
                value={entryMetadata.description}
              />
              {hasEducationalMetadata && (
                <EducationalMetadataFields
                  readOnly={readOnly}
                  handleMetadataChange={handleMetadataChange}
                  entryMetadata={entryMetadata}
                />
              )}
            </Grid>
            <GridSpacer horizontalBorders />
            <Grid container item justifyContent={readOnly ? 'flex-end' : 'space-between'} basis={65} padded shrink={0}>
              {canBeDeleted && <DeleteButton onClick={openDialog} />}
              {!readOnly && <SaveButton onClick={handleSave} disabled={!entryMetadata.name.length} />}
            </Grid>
          </Grid>
        </Grid>
      )}
      <ConfirmDialog
        content={t('window.entry.confirmDialog.content')}
        positiveButtonColor='error'
        onClose={closeDialog}
        onConfirm={handleDelete}
        open={dialogOpen}
      />
    </Window>
  );
};
