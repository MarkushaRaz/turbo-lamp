import { RecordingSource } from '_shared/enums';
import { Group } from './Group';
import { LectureStatus } from './LectureStatus';
import { LectureType } from './LectureType';
import { Room } from './Room';
import { Subject } from './Subject';
import { Teacher } from './Teacher';
import { YearOfStudy } from './YearOfStudy';

export interface Lecture {
  id: number;
  uid: string;
  title: string;
  status: LectureStatus;
  tags: string | null;
  description: string | null;
  youtube_id: string | null;
  kaltura_id: string | null;
  start_time: Date;
  end_time: Date;
  moodle_cmid: number | null;
  sakai_idcs: string | null;
  room: Room;
  teacher: Teacher;
  subject: Subject;
  groups: Array<Group>;
  year: YearOfStudy;
  type: LectureType;
  primary_channel: RecordingSource | null;
  unlisted: boolean;
  meeting_url: string | null;
  created_at: Date;
  updated_at: Date;
}
