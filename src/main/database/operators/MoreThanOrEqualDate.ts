import moment, { Moment } from 'moment';
import { MoreThanOrEqual } from 'typeorm';
import { momentToDbDate } from '../utils';

export function MoreThanOrEqualDate(date: Date | Moment) {
  return MoreThanOrEqual<Date>(momentToDbDate(moment(date)) as unknown as Date);
}
