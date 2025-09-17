import fs from 'fs';
import { app } from 'electron';
import log from 'electron-log';
import { forwardToRenderer, replayActionMain, triggerAlias } from 'electron-redux';
import path from 'path';
import {
  applyMiddleware,
  compose,
  EmptyObject,
  legacy_createStore as createStore,
  Reducer,
  Store,
  StoreEnhancerStoreCreator,
} from 'redux';
import reduxLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { createMigrate, persistReducer, persistStore } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistedState } from 'redux-persist/lib/types';
import createElectronStorage from 'redux-persist-electron-storage';
import { combinedSaga } from '_main/sagas';
import { PERSISTENT_STORAGE_EXT, PERSISTENT_STORAGE_NAME } from '_main/constants';
import { PersistentElectronStorage } from '_main/types';
import { IS_DEBUG_STORE } from '_shared/constants';
import { CombinedStateKey } from '_shared/enums';
import { createRootReducer } from '_shared/reducers';
import { CombinedState } from '_shared/types';
import { asError } from '_shared/utils';
import { storeMigrations } from './store-migrations';

const logger = log.scope('Store');

async function migrateToEncryptedStorageIfJsonStorageExists(encryptedStorage: PersistentElectronStorage<object>) {
  try {
    const jsonStorageFilePath = path.join(app.getPath('userData'), 'config.json');

    if (!fs.existsSync(jsonStorageFilePath)) {
      return;
    }

    logger.info('A preexisting JSON storage found. Migrating to encrypted storage...');

    const jsonStorage = createElectronStorage({
      electronStoreOpts: { clearInvalidConfig: true },
    });

    const rootKey = 'persist:root';
    const rootValue = await jsonStorage.getItem(rootKey);

    if (rootValue) {
      await encryptedStorage.setItem(rootKey, rootValue);
    }

    fs.unlinkSync(jsonStorageFilePath);

    logger.info('Migration to encrypted storage has been successfully completed.');
  } catch (e) {
    logger.error(`Something went wrong when migrating to encrypted storage: ${asError(e).message}`, asError(e));
  }
}

export async function configureStore(
  encryptionKey: string,
  initialState = {},
): Promise<Store<EmptyObject & CombinedState>> {
  logger.debug('Configure store');
  const encryptedStorage = createElectronStorage({
    electronStoreOpts: {
      clearInvalidConfig: true,
      name: PERSISTENT_STORAGE_NAME,
      fileExtension: PERSISTENT_STORAGE_EXT,
      encryptionKey,
    },
  });

  await migrateToEncryptedStorageIfJsonStorageExists(encryptedStorage);

  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [triggerAlias, sagaMiddleware, ...(IS_DEBUG_STORE ? [reduxLogger] : []), forwardToRenderer];
  const enhancers = [applyMiddleware(...middlewares)];

  const persistedReducer = persistReducer(
    {
      key: 'root',
      migrate: createMigrate(storeMigrations, { debug: IS_DEBUG_STORE }),
      stateReconciler: autoMergeLevel2,
      storage: encryptedStorage,
      version: -1,
      whitelist: [CombinedStateKey.CaptureSources, CombinedStateKey.License, CombinedStateKey.Settings],
    },
    createRootReducer() as Reducer<unknown>,
  );

  logger.debug('Create store');
  const store = createStore(
    persistedReducer,
    initialState as PersistedState,
    compose<StoreEnhancerStoreCreator<unknown>>(...enhancers),
  );

  sagaMiddleware.run(combinedSaga);

  replayActionMain(store);
  persistStore(store);

  return store as Store<EmptyObject & CombinedState>;
}
