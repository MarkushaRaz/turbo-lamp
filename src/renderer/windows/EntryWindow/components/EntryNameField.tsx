import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { OutlinedTextField, OutlinedTextFieldProps } from '_renderer/components';

type Props = OutlinedTextFieldProps;

export const EntryNameField: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <OutlinedTextField
      boldLabel
      label={t<string>('window.entry.entryNameField.label')}
      placeholder={t<string>('window.entry.entryNameField.placeholder')}
      required
      {...props}
    />
  );
};
