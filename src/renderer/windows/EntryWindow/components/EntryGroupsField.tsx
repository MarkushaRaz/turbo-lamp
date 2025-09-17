import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { OutlinedTextField, OutlinedTextFieldProps } from '_renderer/components';

type Props = OutlinedTextFieldProps;

export const EntryGroupsField: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <OutlinedTextField
      boldLabel
      label={t<string>('window.entry.entryGroupsField.label')}
      placeholder={t<string>('window.entry.entryGroupsField.placeholder')}
      {...props}
    />
  );
};
