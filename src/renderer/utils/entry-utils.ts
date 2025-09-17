import { EntryStatus } from '_shared/enums';
import { EntryData } from '_shared/types';

export function canEntryBeDeleted(entry: EntryData) {
  return ![EntryStatus.Pending, EntryStatus.Recording, EntryStatus.Uploading].includes(entry.status);
}

export function canEntryBeViewed(entry: EntryData) {
  return ![EntryStatus.Failed, EntryStatus.New, EntryStatus.Pending, EntryStatus.Recording].includes(entry.status);
}
