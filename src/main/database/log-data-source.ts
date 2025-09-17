import { app } from 'electron';
import path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DbLogMessage } from '_main/database/entities';
import { IS_PROD } from '_shared/constants';
import log from 'electron-log';
import { CreateLogMessageTable1712232043935 } from './migrations';

const logger = log.scope('DataSource');

const dbName = 'log.db';
const database = IS_PROD ? path.join(app.getPath('userData'), dbName) : dbName;

const options: DataSourceOptions = {
  type: 'better-sqlite3',
  database,
  logging: false,
  entities: [DbLogMessage],
  namingStrategy: new SnakeNamingStrategy(),
  migrations: [CreateLogMessageTable1712232043935],
  migrationsRun: true,
  synchronize: false,
  entitySkipConstructor: true,
};

const dataSource = new DataSource(options);

export const initializeLogDataSource = (): Promise<DataSource> => {
  logger.info('Initializing the log data source');
  return dataSource.initialize();
};

export const getLogDataSource = () => dataSource;
