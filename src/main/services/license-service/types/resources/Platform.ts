import { DateAttributes } from '../common';

export interface Platform extends DateAttributes {
  name: string;
  key: typeof process.platform;
}
