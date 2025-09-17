import { app } from 'electron';
import { configureStore } from '_main/store';
import { setStore } from '_main/providers';
import { setAppUuidAction, setAppVersionAction, setFingerprintAction } from '_shared/actions';
import log from 'electron-log';

declare const UUID: string | undefined;

const logger = log.scope('Store');

export async function initializeStore(fingerprint: string): Promise<void> {
  logger.info('Initializing the store');
  const store = await configureStore(fingerprint);
  store.dispatch(setFingerprintAction(fingerprint));
  store.dispatch(setAppVersionAction(app.getVersion()));
  if (UUID) store.dispatch(setAppUuidAction(UUID));
  setStore(store);
}
