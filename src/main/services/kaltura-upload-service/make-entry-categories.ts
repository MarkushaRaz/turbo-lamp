import i18n from 'i18next';
import { Entry } from '_main/database/entities';
import { EMPTY_STRING, ENTRY_METADATA_SEPARATOR, MAX_CATEGORIES } from '_shared/constants';
import log from 'electron-log';

const logger = log.scope('MakeCategories');

const pattern = /\s*,+(?:,|\s*)+/gm;
let maxCategories: number;

function getCategorizedValue(category: string, value: string) {
  maxCategories -= 1;
  /* i18next-extract-disable-next-line */
  return value ? i18n.t(`kaltura.category.${category}`).concat(`>${value.replace(pattern, ' ')}`) : EMPTY_STRING;
}

function getUnlistedCategory(isUnlisted: boolean) {
  maxCategories -= 1;
  return isUnlisted ? i18n.t(`kaltura.category.unlisted`) : EMPTY_STRING;
}

function getFacultyCategories(entry: Entry) {
  logger.debug(`Get faculty categories: ${entry.faculties}`);
  if (!entry.faculties) return EMPTY_STRING;
  const faculties = [...new Set(entry.faculties.split(ENTRY_METADATA_SEPARATOR))];

  const facultyCount = faculties.length > maxCategories ? maxCategories : faculties.length;
  maxCategories -= facultyCount;

  const facultyCategoryName = i18n.t('kaltura.category.faculty');
  return faculties
    .slice(0, facultyCount)
    .map((f) => `${facultyCategoryName}>${f.replace(pattern, ' ')}`)
    .join();
}

function getGroupCategories(entry: Entry) {
  logger.debug(`Get group categories: ${entry.groups}`);
  if (!entry.groups) return EMPTY_STRING;
  const groups = [...new Set(entry.groups.split(ENTRY_METADATA_SEPARATOR))];

  const groupsCount = groups.length > maxCategories ? maxCategories : groups.length;
  maxCategories -= groupsCount;

  const groupCategoryName = i18n.t('kaltura.category.group');
  return groups
    .slice(0, groupsCount)
    .map((g) => `${groupCategoryName}>${g.replace(pattern, ' ')}`)
    .join();
}

export function makeEntryCategories(entry: Entry) {
  maxCategories = MAX_CATEGORIES;
  return (
    `${getCategorizedValue('teacher', entry.teacher)},` +
    `${getCategorizedValue('moodle', entry.email)},` +
    `${getCategorizedValue('subject', entry.subject)},` +
    `${getCategorizedValue('year', entry.year)},` +
    `${getCategorizedValue('type', entry.type)},` +
    `${getUnlistedCategory(entry.isUnlisted)},` +
    `${getFacultyCategories(entry)},` +
    `${getGroupCategories(entry)},`
  );
}
