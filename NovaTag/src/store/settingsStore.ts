import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AppSettings } from '@/types/settings';
import { DEFAULT_SETTINGS } from '@/types/settings';
import { storageService } from '@services/storage/storageService';
import { STORAGE_KEYS } from '@constants/app';

interface SettingsStore {
  settings: AppSettings;
  loadSettings: () => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  immer((set, get) => ({
    settings: DEFAULT_SETTINGS,

    loadSettings: () => {
      const raw = storageService.getString(STORAGE_KEYS.SETTINGS);
      if (raw) {
        try {
          const saved: Partial<AppSettings> = JSON.parse(raw);
          set((state) => {
            state.settings = { ...DEFAULT_SETTINGS, ...saved };
          });
        } catch {
          // Use defaults
        }
      }
    },

    updateSettings: (updates) => {
      set((state) => {
        Object.assign(state.settings, updates);
      });
      storageService.set(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(get().settings),
      );
    },

    resetSettings: () => {
      set((state) => {
        state.settings = DEFAULT_SETTINGS;
      });
      storageService.set(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(DEFAULT_SETTINGS),
      );
    },
  })),
);
