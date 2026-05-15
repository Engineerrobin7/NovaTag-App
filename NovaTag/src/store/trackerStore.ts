import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { SavedTracker, LiveTrackerState, ConnectionState } from '@/types/tracker';
import { storageService } from '@services/storage/storageService';
import { STORAGE_KEYS } from '@constants/app';

interface TrackerStore {
  // ─── Persisted ─────────────────────────────────────────────────────────────
  savedTrackers: SavedTracker[];

  // ─── Live (in-memory only) ─────────────────────────────────────────────────
  liveStates: Record<string, LiveTrackerState>;

  // ─── Actions ───────────────────────────────────────────────────────────────
  loadSavedTrackers: () => void;
  addTracker: (tracker: SavedTracker) => void;
  removeTracker: (id: string) => void;
  renameTracker: (id: string, newName: string) => void;
  updateTrackerMetadata: (id: string, updates: Partial<SavedTracker['metadata']>) => void;

  // Live state actions
  setConnectionState: (id: string, state: ConnectionState) => void;
  setRssi: (id: string, rssi: number | null) => void;
  setBatteryLevel: (id: string, level: number | null) => void;
  setFirmwareVersion: (id: string, version: string | null) => void;
  setDeviceInfo: (id: string, info: Partial<LiveTrackerState>) => void;
  setRinging: (id: string, isRinging: boolean) => void;
  setRingLoading: (id: string, loading: boolean) => void;
  setError: (id: string, error: string | null) => void;
  initLiveState: (id: string) => void;
  clearLiveState: (id: string) => void;
}

const defaultLiveState = (id: string): LiveTrackerState => ({
  id,
  connectionState: 'disconnected',
  rssi: null,
  batteryLevel: null,
  firmwareVersion: null,
  hardwareRevision: null,
  manufacturerName: null,
  isRinging: false,
  isRingLoading: false,
  error: null,
});

export const useTrackerStore = create<TrackerStore>()(
  immer((set, get) => ({
    savedTrackers: [],
    liveStates: {},

    loadSavedTrackers: () => {
      const raw = storageService.getString(STORAGE_KEYS.SAVED_TRACKERS);
      if (raw) {
        try {
          const trackers: SavedTracker[] = JSON.parse(raw);
          set((state) => {
            state.savedTrackers = trackers;
          });
        } catch {
          // Corrupted storage — start fresh
        }
      }
    },

    addTracker: (tracker) => {
      set((state) => {
        const exists = state.savedTrackers.find((t) => t.id === tracker.id);
        if (!exists) {
          state.savedTrackers.push(tracker);
        }
      });
      storageService.set(
        STORAGE_KEYS.SAVED_TRACKERS,
        JSON.stringify(get().savedTrackers),
      );
    },

    removeTracker: (id) => {
      set((state) => {
        state.savedTrackers = state.savedTrackers.filter((t) => t.id !== id);
        delete state.liveStates[id];
      });
      storageService.set(
        STORAGE_KEYS.SAVED_TRACKERS,
        JSON.stringify(get().savedTrackers),
      );
    },

    renameTracker: (id, newName) => {
      set((state) => {
        const tracker = state.savedTrackers.find((t) => t.id === id);
        if (tracker) {
          tracker.customName = newName;
          tracker.metadata.customName = newName;
        }
      });
      storageService.set(
        STORAGE_KEYS.SAVED_TRACKERS,
        JSON.stringify(get().savedTrackers),
      );
    },

    updateTrackerMetadata: (id, updates) => {
      set((state) => {
        const tracker = state.savedTrackers.find((t) => t.id === id);
        if (tracker) {
          Object.assign(tracker.metadata, updates);
        }
      });
      storageService.set(
        STORAGE_KEYS.SAVED_TRACKERS,
        JSON.stringify(get().savedTrackers),
      );
    },

    // ─── Live state ──────────────────────────────────────────────────────────
    initLiveState: (id) => {
      set((state) => {
        if (!state.liveStates[id]) {
          state.liveStates[id] = defaultLiveState(id);
        }
      });
    },

    clearLiveState: (id) => {
      set((state) => {
        state.liveStates[id] = defaultLiveState(id);
      });
    },

    setConnectionState: (id, connectionState) => {
      set((state) => {
        if (!state.liveStates[id]) state.liveStates[id] = defaultLiveState(id);
        state.liveStates[id].connectionState = connectionState;
        if (connectionState === 'disconnected') {
          state.liveStates[id].rssi = null;
          state.liveStates[id].isRinging = false;
        }
      });
    },

    setRssi: (id, rssi) => {
      set((state) => {
        if (!state.liveStates[id]) state.liveStates[id] = defaultLiveState(id);
        state.liveStates[id].rssi = rssi;
      });
    },

    setBatteryLevel: (id, level) => {
      set((state) => {
        if (!state.liveStates[id]) state.liveStates[id] = defaultLiveState(id);
        state.liveStates[id].batteryLevel = level;
      });
    },

    setFirmwareVersion: (id, version) => {
      set((state) => {
        if (!state.liveStates[id]) state.liveStates[id] = defaultLiveState(id);
        state.liveStates[id].firmwareVersion = version;
      });
    },

    setDeviceInfo: (id, info) => {
      set((state) => {
        if (!state.liveStates[id]) state.liveStates[id] = defaultLiveState(id);
        Object.assign(state.liveStates[id], info);
      });
    },

    setRinging: (id, isRinging) => {
      set((state) => {
        if (!state.liveStates[id]) state.liveStates[id] = defaultLiveState(id);
        state.liveStates[id].isRinging = isRinging;
      });
    },

    setRingLoading: (id, loading) => {
      set((state) => {
        if (!state.liveStates[id]) state.liveStates[id] = defaultLiveState(id);
        state.liveStates[id].isRingLoading = loading;
      });
    },

    setError: (id, error) => {
      set((state) => {
        if (!state.liveStates[id]) state.liveStates[id] = defaultLiveState(id);
        state.liveStates[id].error = error;
      });
    },
  })),
);
