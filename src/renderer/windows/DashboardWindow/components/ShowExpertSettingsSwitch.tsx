import React, { FunctionComponent } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  checked: boolean;
  onChange?(): void;
}

export const ShowExpertSettingsSwitch: FunctionComponent<Props> = ({ checked, onChange }: Props) => {
  const { t } = useTranslation();

  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={onChange} />}
      label={t<string>('window.dashboard.settings.showExpertSettingsSwitch.label')}
    />
  );
};

ShowExpertSettingsSwitch.defaultProps = {
  onChange: undefined,
};
