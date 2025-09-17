import { getLogDataSource } from '_main/database/log-data-source';
import { DbLogMessage } from '_main/database/entities/DbLogMessage';
import { DbLogMessageParams } from '_/main/types';

export const dbLogMessageRepository = getLogDataSource()
  .getRepository(DbLogMessage)
  .extend({
    saveLogMessages(logMessages: DbLogMessageParams[]) {
      const dbLogMessages: DbLogMessage[] = [];
      for (const logMessage of logMessages) {
        const { date, json, level, process, scope, text, trace } = logMessage;
        dbLogMessages.push(new DbLogMessage(text, level, date, process, scope || '', trace, json));
      }
      return dbLogMessageRepository.save(dbLogMessages);
    },
  });
