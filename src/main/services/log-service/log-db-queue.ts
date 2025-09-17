import { app } from 'electron';
import { error } from 'electron-log';
import { dbLogMessageRepository } from '_main/database/repositories';
import { DbLogMessageParams } from '_/main/types';

const logMessageQueue = new Array<DbLogMessageParams>();

const saveQueuedMessagesToDb = async (): Promise<void> => {
  const messages = logMessageQueue.splice(0);
  await dbLogMessageRepository.saveLogMessages(messages).catch(error);
  setTimeout(saveQueuedMessagesToDb, 500);
};

app.on('before-quit', saveQueuedMessagesToDb);

export const startDbLogQueueService = saveQueuedMessagesToDb;

export const addLogMessageToDb = (message: DbLogMessageParams): number => logMessageQueue.push(message);
