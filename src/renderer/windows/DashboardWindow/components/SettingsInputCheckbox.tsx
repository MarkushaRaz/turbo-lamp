import { Checkbox, FormControlLabel } from '@mui/material';

import React, { ChangeEvent, FunctionComponent } from 'react';

export type SettingsInputCheckboxProps = {
  checked: boolean;
  className?: string;
  disabled?: boolean;
  label?: string;
  onChange?(value: boolean): void;
  onValueChange?(value: boolean): void;
};

export const SettingsInputCheckbox: FunctionComponent<SettingsInputCheckboxProps> = ({
  checked,
  className,
  disabled,
  label,
  onChange,
  onValueChange,
}: SettingsInputCheckboxProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(event.target.checked);
    if (onValueChange) onValueChange(event.target.checked);
  };

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  return (
    <FormControlLabel
      className={className}
      control={<Checkbox checked={checked} disabled={disabled} onChange={handleChange} />}
      label={label!}
    />
  );
};

SettingsInputCheckbox.defaultProps = {
  className: '',
  disabled: false,
  label: '',
  onChange: undefined,
  onValueChange: undefined,
};
