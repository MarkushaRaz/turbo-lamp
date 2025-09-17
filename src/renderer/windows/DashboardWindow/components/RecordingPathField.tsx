/* eslint-disable react/destructuring-assignment */

import { dialog, getCurrentWindow } from '@electron/remote';
import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useTranslation } from 'react-i18next';
import log from 'electron-log';
import { asError } from '_/shared/utils';
import { SelectDirectoryButton } from './SelectDirectoryButton';
import { SettingsInputField, SettingsInputFieldProps } from './SettingsInputField';

const logger = log.scope('RecordingPathField');

type Props = SettingsInputFieldProps;

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    marginBottom: theme.spacing(3),
  },
  button: {
    alignSelf: 'flex-end',
    marginLeft: theme.spacing(2),
    height: theme.spacing(5),
  },
  textField: {
    flexGrow: 1,
  },
}));

export const RecordingPathField: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  const handleClick = () => {
    dialog
      .showOpenDialog(getCurrentWindow(), {
        defaultPath: props.value as string,
        properties: ['openDirectory', 'createDirectory', 'dontAddToRecent'],
      })
      .then((result) => {
        if (result.canceled || !result.filePaths.length || !props.onValueChange) return;
        props.onValueChange(result.filePaths[0].split('/').join('//'));
        logger.info(`New path to recordings: ${result.filePaths[0]}`);
      })
      .catch((e): void => {
        logger.error(asError(e).message, asError(e));
      });
  };

  return (
    <div className={classes.root}>
      <SettingsInputField
        label={t<string>('window.dashboard.settings.recordingPath.label')}
        {...props}
        className={classes.textField}
      />
      <SelectDirectoryButton className={classes.button} onClick={handleClick} />
    </div>
  );
};
