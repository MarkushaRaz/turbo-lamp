import { EmptyObject, Store } from 'redux';
import { CombinedState } from '_shared/types';

let storeObject: Store<EmptyObject & CombinedState>;

export function setStore(store: Store<EmptyObject & CombinedState>) {
  storeObject = store;
}

export function getStore() {
  return storeObject;
}

export function getState() {
  return storeObject.getState();
}

export function getSettings() {
  return getState().settings;
}

export function getCaptureSources() {
  return getState().captureSources;
}

export function getRecordingState() {
  return getState().recording;
}

export function getEntryWindowMode() {
  return getState().entryWindow.mode;
}
