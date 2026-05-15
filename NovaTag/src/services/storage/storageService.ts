/**
 * Storage Service
 * Wraps MMKV for fast synchronous key-value storage.
 * Falls back gracefully if MMKV is unavailable (e.g., in tests).
 */
import { MMKV } from 'react-native-mmkv';

let storage: MMKV | null = null;

const getStorage = (): MMKV => {
  if (!storage) {
    storage = new MMKV({ id: 'novatag-storage' });
  }
  return storage;
};

export const storageService = {
  getString: (key: string): string | undefined => {
    try {
      return getStorage().getString(key);
    } catch {
      return undefined;
    }
  },

  set: (key: string, value: string): void => {
    try {
      getStorage().set(key, value);
    } catch {
      // Silently fail in environments without native modules
    }
  },

  getBoolean: (key: string): boolean | undefined => {
    try {
      return getStorage().getBoolean(key);
    } catch {
      return undefined;
    }
  },

  setBoolean: (key: string, value: boolean): void => {
    try {
      getStorage().set(key, value);
    } catch {}
  },

  delete: (key: string): void => {
    try {
      getStorage().delete(key);
    } catch {}
  },

  clearAll: (): void => {
    try {
      getStorage().clearAll();
    } catch {}
  },
};
