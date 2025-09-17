import React, { FunctionComponent } from 'react';
import { EntryMetadata } from '../types';
import { EntryEmailField } from './EntryEmailField';
import { EntryFacultiesField } from './EntryFacultiesField';
import { EntryGroupsField } from './EntryGroupsField';
import { EntrySubjectField } from './EntrySubjectField';
import { EntryTeacherField } from './EntryTeacherField';
import { EntryTypeField } from './EntryTypeField';
import { EntryYearField } from './EntryYearField';

interface Props {
  readOnly: boolean;
  handleMetadataChange: (stateSlice: Partial<EntryMetadata>) => void;
  entryMetadata: EntryMetadata;
}

export const EducationalMetadataFields: FunctionComponent<Props> = ({
  entryMetadata,
  readOnly,
  handleMetadataChange,
}: Props) => {
  return (
    <>
      <EntryTeacherField
        disabled={readOnly}
        onChange={({ target: { value } }) => handleMetadataChange({ teacher: value })}
        value={entryMetadata.teacher}
      />
      <EntryEmailField
        disabled={readOnly}
        onChange={({ target: { value } }) => handleMetadataChange({ email: value })}
        value={entryMetadata.email}
      />
      <EntrySubjectField
        disabled={readOnly}
        onChange={({ target: { value } }) => handleMetadataChange({ subject: value })}
        value={entryMetadata.subject}
      />
      <EntryTypeField
        disabled={readOnly}
        onChange={({ target: { value } }) => handleMetadataChange({ type: value })}
        value={entryMetadata.type}
      />
      <EntryFacultiesField
        disabled={readOnly}
        onChange={({ target: { value } }) => handleMetadataChange({ faculties: value })}
        value={entryMetadata.faculties}
      />
      <EntryGroupsField
        disabled={readOnly}
        onChange={({ target: { value } }) => handleMetadataChange({ groups: value })}
        value={entryMetadata.groups}
      />
      <EntryYearField
        disabled={readOnly}
        onChange={({ target: { value } }) => handleMetadataChange({ year: value })}
        value={entryMetadata.year}
      />
    </>
  );
};
