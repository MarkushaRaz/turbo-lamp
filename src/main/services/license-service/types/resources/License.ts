import { AudioProcessorType } from '_shared/enums';
import { DateAttributes } from '../common';
import { RelationToMany, RelationToOne } from '../relations';
import { Partner } from './Partner';
import { Policy } from './Policy';

export interface License extends DateAttributes {
  name: string;
  fingerprint: string;
  scheduleRoomNumber: string | null;
  ptzCameraIp: string | null;
  partner: RelationToOne<Partner>;
  audioProcessorIp?: string | null;
  audioProcessorType?: AudioProcessorType | null;
  policies: RelationToMany<Policy>;
}
