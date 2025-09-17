import fs from 'fs';
import path from 'path';
import moment from 'moment';
import { initialize, transports, hooks, LogFile, LogMessage, Format, warn } from 'electron-log';
import { DEFAULT_LOG_PATH, ENABLE_DB_LOG, LOG_FILE_DATE_FORMAT, LOG_FILE_NAME } from '_main/constants';
import { addLogMessageToDb } from '_main/services';
import { IS_DEV_OR_DEBUG } from '_shared/constants';
import { asError } from '_shared/utils';

const createLogDirIfNotExists = (dir: string): string => {
  try {
    const dirPath = path.join(dir, moment().format(LOG_FILE_DATE_FORMAT));
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
    return dirPath;
  } catch (e) {
    const error = asError(e);
    warn('Could not find/create log dir:', error.message, error);
    return dir;
  }
};

const archiveLog = (file: LogFile): void => {
  try {
    const { dir, name, ext } = path.parse(file.path);
    const newPath = path.join(createLogDirIfNotExists(dir), `${Date.now()}.${name}.old${ext}`);
    fs.renameSync(file.path, newPath);
  } catch (e) {
    const error = asError(e);
    warn('Could not rotate log:', error.message, error);
  }
};

const isJsonString = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const spliceItem = <T>(data: unknown[], index: number): T => data.splice(index, 1)[0] as T;

const getData = <T>(
  data: unknown[],
  predicate: (value: unknown, index: number, array: unknown[]) => unknown,
): T | undefined => {
  const index = data.findLastIndex(predicate);
  return index === -1 ? undefined : spliceItem<T>(data, index);
};

const getJsonData = (data: unknown[]): string => {
  return getData(data, (item) => typeof item === 'string' && isJsonString(item)) || '';
};

const getErrorTrace = (data: unknown[]): string => {
  return getData<Error>(data, (item) => item instanceof Error)?.stack || '';
};

const processLogMessage = (message: LogMessage): LogMessage => {
  if (message.variables?.putOnSave) return message;
  const { data, date, level, scope } = message;
  const trace = getErrorTrace(data);
  const text = data.join(' ').trimEnd();
  const json = getJsonData(data);
  const process = message.variables?.processType?.replace('browser', 'main') || '';
  message.data = [text];
  if (message.variables) message.variables.putOnSave = true;
  if (ENABLE_DB_LOG) {
    addLogMessageToDb({ date, level, scope, trace, text, json, process });
  }
  return message;
};

const formattedDate = (date: Date) => {
  return moment(date).format('DD-MM-YYYY | HH:mm:ss.SSS | Z |');
};

const format: Format = ({ message }: { message: LogMessage }) => {
  const {
    date,
    scope,
    data: [text],
    level,
    variables,
  } = message;
  const formattedLevel = level.padEnd(5);
  const formattedProcess = variables?.processType.padEnd(8);
  const formattedScope = scope?.padEnd(30);
  return [formattedDate(date), formattedLevel, '|', formattedProcess, '|', formattedScope, '|', text];
};

const level = IS_DEV_OR_DEBUG ? 'debug' : 'info';

initialize();

transports.file.sync = false;
transports.file.resolvePathFn = () => path.join(DEFAULT_LOG_PATH, LOG_FILE_NAME);

transports.console.format = format;
transports.console.level = level;

transports.file.format = format;
transports.file.level = level;

// 10 Mbit
transports.file.maxSize = 10_485_760;

transports.file.archiveLogFn = archiveLog;

hooks.push(processLogMessage);
