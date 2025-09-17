import moment, { Moment } from 'moment';
import { LessThanOrEqual } from 'typeorm';
import { momentToDbDate } from '../utils';

export function LessThanOrEqualDate(date: Date | Moment) {
  return LessThanOrEqual<Date>(momentToDbDate(moment(date)) as unknown as Date);
}
