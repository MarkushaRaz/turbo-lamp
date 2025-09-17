import { EntryData } from '_shared/types/data/EntryData';

export interface LibraryState {
  entries: EntryData[];
  error: boolean;
  loading: boolean;
  page: number;
  totalCount: number;
}
