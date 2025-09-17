/* eslint no-underscore-dangle: off */

import {
  applyMiddleware,
  compose,
  EmptyObject,
  legacy_createStore as createStore,
  Store,
  StoreEnhancerStoreCreator,
} from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { forwardToMain, getInitialStateRenderer, replayActionRenderer } from 'electron-redux';
import { createRootReducer } from '_shared/reducers';
import { CombinedState } from '_shared/types';
import { combinedSaga } from '_renderer/sagas';
import { IS_DEBUG_STORE, IS_DEV } from '_/shared/constants';
import { CombinedStateKey } from '_shared/enums';
import { PersistState } from 'redux-persist/es/types';

export function configureStore(): Store<EmptyObject & CombinedState> {
  let composeEnhancers = compose;
  let reduxSagaMonitorOptions = {};

  if (IS_DEV && typeof window === 'object') {
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});
    }

    if (window.__SAGA_MONITOR_EXTENSION__) {
      reduxSagaMonitorOptions = {
        sagaMonitor: window.__SAGA_MONITOR_EXTENSION__,
      };
    }
  }

  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const middlewares = [forwardToMain, sagaMiddleware, ...(IS_DEBUG_STORE ? [logger] : [])];

  const enhancers = [applyMiddleware(...middlewares)];

  const reducer = createRootReducer({
    [CombinedStateKey.Persist]: (state: PersistState) => state ?? {},
  });

  const store = createStore(
    reducer,
    getInitialStateRenderer(),
    composeEnhancers<StoreEnhancerStoreCreator<unknown>>(...enhancers),
  );

  sagaMiddleware.run(combinedSaga);
  replayActionRenderer(store);

  return store;
}
