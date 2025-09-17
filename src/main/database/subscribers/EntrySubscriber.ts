import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm';
import { Entry, Recording } from '_main/database/entities';

@EventSubscriber()
export class EntrySubscriber implements EntitySubscriberInterface<Entry> {
  listenTo() {
    return Entry;
  }

  beforeRemove(event: RemoveEvent<Entry>) {
    if (!event.entity?.recordings) return Promise.resolve();
    return event.manager.getRepository(Recording).remove(event.entity.recordings);
  }
}
