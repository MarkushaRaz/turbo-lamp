import React, { FunctionComponent } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';
import { useTranslation } from 'react-i18next';
import { EntryStatus } from '_shared/enums';
import { EntryData } from '_shared/types';
import log from 'electron-log';

const logger = log.scope('EntryStatusText');

interface Props {
  entry: EntryData;
}

const entryStatusToThemeColor = (entryStatus: EntryStatus, theme: Theme) => {
  switch (entryStatus) {
    case EntryStatus.Failed:
      return theme.palette.error.main;
    case EntryStatus.Missed:
      return theme.palette.error.dark;
    case EntryStatus.New:
      return theme.palette.text.primary;
    case EntryStatus.Pending:
      return '#c19b00';
    case EntryStatus.ReadyToUpload:
      return theme.palette.primary.main;
    case EntryStatus.Recorded:
      return theme.palette.secondary.main;
    case EntryStatus.Recording:
      return '#de6723';
    case EntryStatus.Uploaded:
      return theme.palette.success.main;
    case EntryStatus.Uploading:
      return '#95ab13';
    default:
      return theme.palette.text.primary;
  }
};

const useStyles = makeStyles<Pick<Props, 'entry'>>()((theme, { entry: { status } }) => ({
  statusText: {
    color: entryStatusToThemeColor(status, theme),
  },
}));

function getUploadedPercentage(entry: EntryData) {
  const percentage = ((entry.bytesUploaded / entry.size) * 100).toFixed(0);
  logger.info(`Entry ${entry.id} - ${entry.name} upload ${percentage}%`);
  return percentage;
}

export const EntryStatusText: FunctionComponent<Props> = ({ entry }: Props) => {
  const { classes } = useStyles({ entry });
  const { t } = useTranslation();

  let statusText;
  switch (entry.status) {
    case EntryStatus.Failed:
      statusText = t('general.entryStatus.failed');
      break;
    case EntryStatus.Missed:
      statusText = t('general.entryStatus.missed');
      break;
    case EntryStatus.New:
      statusText = t('general.entryStatus.new');
      break;
    case EntryStatus.Pending:
      statusText = t('general.entryStatus.pending');
      break;
    case EntryStatus.ReadyToUpload:
      statusText = t('general.entryStatus.readyToUpload');
      break;
    case EntryStatus.Recorded:
      statusText = t('general.entryStatus.recorded');
      break;
    case EntryStatus.Recording:
      statusText = t('general.entryStatus.recording');
      break;
    case EntryStatus.Uploaded:
      statusText = t('general.entryStatus.uploaded');
      break;
    case EntryStatus.Uploading:
      statusText = `${t('general.entryStatus.uploading')} (${getUploadedPercentage(entry)}%)`;
      break;
    case EntryStatus.PartiallyUploaded:
      statusText = t('general.entryStatus.partiallyUploaded');
      break;
    default:
      return <>{t('general.entryStatus.unknown')}</>;
  }

  return (
    <>
      <b>{t('general.status')}: </b>
      <span className={classes.statusText}>{statusText}</span>
    </>
  );
};
