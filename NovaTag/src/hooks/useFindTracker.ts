import { useState, useEffect, useCallback } from 'react';
import { useTrackerStore } from '@store/trackerStore';
import { getActiveBleService } from '@services/ble/bleProvider';
import { SCAN_CONFIG } from '@constants/ble';
import type { ProximityLevel } from '@/types/tracker';

interface UseFindTracker {
  rssi: number | null;
  proximity: ProximityLevel;
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
}

export const rssiToProximity = (rssi: number | null): ProximityLevel => {
  if (rssi === null) return 'disconnected';
  const { VERY_CLOSE, NEARBY, FAR, WEAK } = SCAN_CONFIG.RSSI_THRESHOLDS;
  if (rssi >= VERY_CLOSE) return 'very_close';
  if (rssi >= NEARBY) return 'nearby';
  if (rssi >= FAR) return 'far';
  if (rssi >= WEAK) return 'weak';
  return 'disconnected';
};

export const useFindTracker = (trackerId: string): UseFindTracker => {
  const liveState = useTrackerStore((s) => s.liveStates[trackerId]);
  const setRssi = useTrackerStore((s) => s.setRssi);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const rssi = liveState?.rssi ?? null;
  const proximity = rssiToProximity(rssi);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    getActiveBleService().startRssiMonitor(
      trackerId,
      (newRssi) => setRssi(trackerId, newRssi),
      () => setIsMonitoring(false),
    );
  }, [trackerId, setRssi]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    getActiveBleService().stopRssiMonitor(trackerId);
  }, [trackerId]);

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return { rssi, proximity, isMonitoring, startMonitoring, stopMonitoring };
};
