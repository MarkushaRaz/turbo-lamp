import { EmptyObject, Store } from 'redux';
import { CombinedState } from '_shared/types';
import { configureStore } from './configure-store';

export const store: Store<EmptyObject & CombinedState> = configureStore();
