import moment, { Moment } from 'moment';
import { MoreThan } from 'typeorm';
import { momentToDbDate } from '../utils';

export function MoreThanDate(date: Date | Moment) {
  return MoreThan<Date>(momentToDbDate(moment(date)) as unknown as Date);
}
