import moment, { Moment } from 'moment';
import { LessThan } from 'typeorm';
import { momentToDbDate } from '../utils';

export function LessThanDate(date: Date | Moment) {
  return LessThan<Date>(momentToDbDate(moment(date)) as unknown as Date);
}
