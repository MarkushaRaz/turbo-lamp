import { MenuItem } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { BridgeMode } from '_/shared/enums';
import { makeStyles } from 'tss-react/mui';
import { SettingsSelectField, SettingsSelectFieldProps } from './SettingsSelectField';

type Props = SettingsSelectFieldProps;

const useStyles = makeStyles()((theme) => ({
  root: {
    margin: theme.spacing(1, 0),
  },
}));

export const BridgeModeSelectField: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  function optionItem(_value: number | string) {
    switch (_value) {
      case 1:
        return t<string>('window.dashboard.settings.bridgeModeSelectField.conference');
      case 2:
        return t<string>('window.dashboard.settings.bridgeModeSelectField.broadcast');
      default:
        return t<string>('window.dashboard.settings.bridgeModeSelectField.custom');
    }
  }

  return (
    <SettingsSelectField
      className={classes.root}
      label={t<string>('window.dashboard.settings.bridgeModeSelectField.label')}
      options={Object.values<number | string>(BridgeMode)
        .filter((value) => typeof value === 'number')
        .map((value) => (
          <MenuItem value={value} key={value}>
            {optionItem(value)}
          </MenuItem>
        ))}
      {...props}
    />
  );
};
