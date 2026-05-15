/**
 * BLE Provider
 * Returns either the real BLE service or the mock service
 * based on the current mock mode setting.
 */
import { bleService } from './bleService';
import { mockBleService } from './mockBleService';
import { useSettingsStore } from '@store/settingsStore';

/**
 * Get the active BLE service (real or mock).
 * Call this inside hooks/components — not at module level.
 */
export const getActiveBleService = () => {
  const mockMode = useSettingsStore.getState().settings.mockMode;
  return mockMode ? mockBleService : bleService;
};

/**
 * For use outside React (e.g., background tasks).
 * Pass mockMode explicitly.
 */
export const getBleService = (mockMode: boolean) => {
  return mockMode ? mockBleService : bleService;
};
