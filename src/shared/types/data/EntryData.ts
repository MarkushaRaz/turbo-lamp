import { EntryStatus, RecordingSource } from '_shared/enums';
import { RecordingData } from '_shared/types/data/RecordingData';

export interface EntryData {
  id: number;
  name: string;
  startTime: Date;
  endTime: Date | null;
  isFromSchedule: boolean;
  scheduleId: number | null;
  scheduleUpdatedAt: Date | null;
  status: EntryStatus;
  duration: number;
  size: number;
  bytesUploaded: number;
  tags: string;
  description: string;
  teacher: string;
  email: string;
  subject: string;
  year: string;
  groups: string;
  faculties: string;
  type: string;
  moodleCmid: number | null;
  sakaiIdcs: string | null;
  primaryChannel: RecordingSource;
  isUnlisted: boolean;
  recordings: Array<RecordingData>;
}
