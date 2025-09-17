export interface PersistentElectronStorage<T> {
  getItem<K extends keyof T>(key: K): Promise<T[K]>;
  getItem(key: string): Promise<unknown>;

  setItem<K extends keyof T>(key: K, item: T[K]): Promise<void>;
  setItem(key: string, item: unknown): Promise<void>;

  removeItem<K extends keyof T>(key: K): Promise<void>;
  removeItem(key: string): Promise<void>;
}
