import { EntryData } from '_shared/types';

export type EntryMetadata = Pick<
  EntryData,
  'name' | 'tags' | 'description' | 'teacher' | 'email' | 'subject' | 'faculties' | 'groups' | 'type' | 'year'
>;
