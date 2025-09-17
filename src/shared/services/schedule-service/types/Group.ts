import { Faculty } from './Faculty';

export interface Group {
  id: number;
  name: string;
  faculty: Faculty;
  created_at: Date;
  updated_at: Date;
}
