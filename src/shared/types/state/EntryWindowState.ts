import { EntryWindowMode } from '_shared/enums';
import { EntryData } from '_shared/types/data/EntryData';

export interface EntryWindowState {
  entry?: EntryData;
  mode: EntryWindowMode;
}
