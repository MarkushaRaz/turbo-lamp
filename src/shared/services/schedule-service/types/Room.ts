import { RecordingSource } from '_shared/enums';
import { RoomType } from './RoomType';

export interface Room {
  id: number;
  name: string;
  number: string;
  address: string | null;
  external_id: string | null;
  epiphan_address: string | null;
  epiphan_login: string | null;
  epiphan_password: string | null;
  epiphan_serial: string | null;
  created_at: Date;
  updated_at: Date;
  primary_channel: RecordingSource;
  room_type: RoomType;
  last_online: Date;
}
