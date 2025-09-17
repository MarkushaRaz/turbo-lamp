import React, { ChangeEvent, FunctionComponent } from 'react';
import { OutlinedTextField, OutlinedTextFieldProps } from '_renderer/components';

export type SettingsInputFieldProps = Pick<
  OutlinedTextFieldProps,
  | 'className'
  | 'disabled'
  | 'error'
  | 'helperText'
  | 'id'
  | 'inputProps'
  | 'label'
  | 'onChange'
  | 'placeholder'
  | 'required'
  | 'type'
  | 'value'
> & {
  maxLength?: number;
  onValueChange?(value: string): void;
};

export const SettingsInputField: FunctionComponent<SettingsInputFieldProps> = ({
  onChange,
  maxLength,
  onValueChange,
  ...props
}: SettingsInputFieldProps) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (onChange) onChange(event);
    if (onValueChange) onValueChange(event.target.value);
  };

  return <OutlinedTextField onChange={handleChange} {...props} inputProps={{ maxLength }} />;
};

SettingsInputField.defaultProps = {
  maxLength: undefined,
  onValueChange: undefined,
};
