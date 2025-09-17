import { Entitlement as Code } from '_shared/enums/Entitlement';
import { DateAttributes } from '../common';

export interface Entitlement extends DateAttributes {
  name: string;
  code: Code;
  uuid: string;
  metadata: unknown | null;
}
