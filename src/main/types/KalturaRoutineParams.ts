import { Entry, Recording } from '_main/database/entities';

export interface KalturaRoutineParams {
  recording: Recording;
  entry: Entry;
}
