import React, { ChangeEvent, FunctionComponent } from 'react';
import { OutlinedSelectField, OutlinedSelectFieldProps } from '_renderer/components';

export type SettingsSelectFieldProps = Pick<
  OutlinedSelectFieldProps,
  'className' | 'disabled' | 'label' | 'value' | 'options'
> & {
  onValueChange?(value: unknown): void;
};

export const SettingsSelectField: FunctionComponent<SettingsSelectFieldProps> = ({
  onValueChange,
  ...props
}: SettingsSelectFieldProps) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (onValueChange) onValueChange(event.target.value);
  };

  return <OutlinedSelectField onChange={handleChange} {...props} />;
};

SettingsSelectField.defaultProps = {
  onValueChange: undefined,
};
