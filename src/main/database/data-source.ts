import { app } from 'electron';
import path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Entry, Recording } from '_main/database/entities';
import {
  AddMoodleCmidColumnToEntryTable1650897900230,
  AddSakaiIdcsColumnToEntryTable1664635168159,
  AddScheduleIdColumnToEntryTable1647527327913,
  AddScheduleUpdatedAtColumnToEntryTable1648037541777,
  CopyDataFromEntryToEntryNewTable1664628067102,
  CopyDataFromEntryToEntryNewTable1664892690750,
  CreateEntryNewTable1664628022222,
  CreateEntryNewTableChangePrimaryChannelDefault1664892584046,
  CreateEntryTable1629901725207,
  CreateRecordingTable1629901744748,
  DropEntryTable1664628255280,
  DropEntryTable1664892723526,
  RemoveIsDualColumnFromEntryTable1648121399586,
  RenameEntryNewTableToEntry1664628300462,
  RenameEntryNewTableToEntry1664892741437,
  AddIsUpdatedColumnToEntryTable1685610003012,
} from '_main/database/migrations';
import { EntrySubscriber, RecordingSubscriber } from '_main/database/subscribers';
import { IS_PROD } from '_shared/constants';
import log from 'electron-log';

const logger = log.scope('DataSource');

const dbName = 'app.db';
const database = IS_PROD ? path.join(app.getPath('userData'), dbName) : dbName;

const options: DataSourceOptions = {
  type: 'better-sqlite3',
  database,
  logging: false,
  entities: [Entry, Recording],
  namingStrategy: new SnakeNamingStrategy(),
  migrations: [
    CreateEntryTable1629901725207,
    CreateRecordingTable1629901744748,
    AddScheduleIdColumnToEntryTable1647527327913,
    AddScheduleUpdatedAtColumnToEntryTable1648037541777,
    RemoveIsDualColumnFromEntryTable1648121399586,
    AddMoodleCmidColumnToEntryTable1650897900230,
    CreateEntryNewTable1664628022222,
    CopyDataFromEntryToEntryNewTable1664628067102,
    DropEntryTable1664628255280,
    RenameEntryNewTableToEntry1664628300462,
    AddSakaiIdcsColumnToEntryTable1664635168159,
    CreateEntryNewTableChangePrimaryChannelDefault1664892584046,
    CopyDataFromEntryToEntryNewTable1664892690750,
    DropEntryTable1664892723526,
    RenameEntryNewTableToEntry1664892741437,
    AddIsUpdatedColumnToEntryTable1685610003012,
  ],
  migrationsRun: true,
  subscribers: [EntrySubscriber, RecordingSubscriber],
  synchronize: false,
};

const dataSource = new DataSource(options);

export const initializeDataSource = (): Promise<DataSource> => {
  logger.info('Initializing the main data source');
  return dataSource.initialize();
};

export const getDataSource = () => dataSource;
