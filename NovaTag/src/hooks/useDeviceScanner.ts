import { useCallback, useEffect, useRef } from 'react';
import { useScanStore } from '@store/scanStore';
import { useTrackerStore } from '@store/trackerStore';
import { getActiveBleService } from '@services/ble/bleProvider';
import { SCAN_CONFIG } from '@constants/ble';
import type { ScannedDevice } from '@/types/tracker';

interface UseDeviceScanner {
  isScanning: boolean;
  scannedDevices: ScannedDevice[];
  scanError: string | null;
  startScan: () => void;
  stopScan: () => void;
}

export const useDeviceScanner = (): UseDeviceScanner => {
  const { isScanning, scannedDevices, scanError, setScanning, addOrUpdateDevice, clearDevices, setScanError } =
    useScanStore();
  const savedTrackers = useTrackerStore((s) => s.savedTrackers);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopScan = useCallback(() => {
    getActiveBleService().stopDeviceScan();
    setScanning(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [setScanning]);

  const startScan = useCallback(() => {
    if (isScanning) return;
    clearDevices();
    setScanning(true);

    const pairedIds = savedTrackers.map((t) => t.id);

    getActiveBleService().startDeviceScan(
      (device) => {
        addOrUpdateDevice(device);
      },
      (error) => {
        setScanError(error.message ?? 'Scan failed');
      },
      pairedIds,
    );

    // Auto-stop
    timeoutRef.current = setTimeout(() => {
      stopScan();
    }, SCAN_CONFIG.TIMEOUT_MS);
  }, [isScanning, savedTrackers, clearDevices, setScanning, addOrUpdateDevice, setScanError, stopScan]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isScanning) {
        stopScan();
      }
    };
  }, []);

  return {
    isScanning,
    scannedDevices,
    scanError,
    startScan,
    stopScan,
  };
};
