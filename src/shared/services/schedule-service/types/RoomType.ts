export interface RoomType {
  id: number;
  name: string;
  code: string;
  settings: unknown;
  control_service: boolean;
  created_at: Date;
  updated_at: Date;
}
