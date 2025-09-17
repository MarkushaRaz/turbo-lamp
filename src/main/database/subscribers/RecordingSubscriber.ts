import log from 'electron-log';
import fs from 'fs';
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm';
import { promisify } from 'util';
import { Recording } from '_main/database/entities';

const logger = log.scope('RecordingSubscriber');

@EventSubscriber()
export class RecordingSubscriber implements EntitySubscriberInterface<Recording> {
  listenTo() {
    return Recording;
  }

  beforeRemove(event: RemoveEvent<Recording>) {
    if (!event.entity?.filePath || !fs.existsSync(event.entity.filePath)) {
      return Promise.resolve();
    }

    return promisify(fs.unlink)(event.entity.filePath).catch(() =>
      logger.warn(`Failed to delete the recording file located at ${event.entity?.filePath}`),
    );
  }
}
