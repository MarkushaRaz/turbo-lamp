import { Moment } from 'moment';
import { DATABASE_DATETIME_FORMAT } from '_main/constants';

export function momentToDbDate(date: Moment): string {
  return date.utc().format(DATABASE_DATETIME_FORMAT);
}
