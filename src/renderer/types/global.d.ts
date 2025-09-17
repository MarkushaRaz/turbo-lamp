import { compose } from 'redux';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?(args?: unknown): typeof compose;
    __SAGA_MONITOR_EXTENSION__?(args?: unknown): unknown;
  }
}

export {};
