import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ScannedDevice } from '@/types/tracker';

interface ScanStore {
  isScanning: boolean;
  scannedDevices: ScannedDevice[];
  scanError: string | null;

  setScanning: (scanning: boolean) => void;
  addOrUpdateDevice: (device: ScannedDevice) => void;
  clearDevices: () => void;
  setScanError: (error: string | null) => void;
}

export const useScanStore = create<ScanStore>()(
  immer((set) => ({
    isScanning: false,
    scannedDevices: [],
    scanError: null,

    setScanning: (scanning) => {
      set((state) => {
        state.isScanning = scanning;
        if (scanning) {
          state.scanError = null;
        }
      });
    },

    addOrUpdateDevice: (device) => {
      set((state) => {
        const idx = state.scannedDevices.findIndex((d) => d.id === device.id);
        if (idx >= 0) {
          state.scannedDevices[idx] = device;
        } else {
          state.scannedDevices.push(device);
        }
      });
    },

    clearDevices: () => {
      set((state) => {
        state.scannedDevices = [];
      });
    },

    setScanError: (error) => {
      set((state) => {
        state.scanError = error;
        state.isScanning = false;
      });
    },
  })),
);
