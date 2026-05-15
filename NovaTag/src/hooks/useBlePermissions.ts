import { useState, useCallback } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
  type Permission,
} from 'react-native-permissions';

export type PermissionStatus =
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'unavailable'
  | 'checking'
  | 'idle';

interface BlePermissionsState {
  status: PermissionStatus;
  isGranted: boolean;
  isBlocked: boolean;
  requestPermissions: () => Promise<boolean>;
  openAppSettings: () => void;
}

const getRequiredPermissions = (): Permission[] => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 31) {
      // Android 12+
      return [
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ];
    }
    // Android < 12
    return [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
  }
  if (Platform.OS === 'ios') {
    return [PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL];
  }
  return [];
};

export const useBlePermissions = (): BlePermissionsState => {
  const [status, setStatus] = useState<PermissionStatus>('idle');

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    setStatus('checking');
    const permissions = getRequiredPermissions();

    if (permissions.length === 0) {
      setStatus('granted');
      return true;
    }

    try {
      let allGranted = true;
      let anyBlocked = false;

      for (const permission of permissions) {
        const result = await check(permission);

        if (result === RESULTS.DENIED) {
          const requestResult = await request(permission);
          if (requestResult !== RESULTS.GRANTED) {
            allGranted = false;
            if (requestResult === RESULTS.BLOCKED) anyBlocked = true;
          }
        } else if (result === RESULTS.BLOCKED) {
          allGranted = false;
          anyBlocked = true;
        } else if (result !== RESULTS.GRANTED) {
          allGranted = false;
        }
      }

      if (anyBlocked) {
        setStatus('blocked');
        return false;
      }

      if (allGranted) {
        setStatus('granted');
        return true;
      }

      setStatus('denied');
      return false;
    } catch {
      setStatus('denied');
      return false;
    }
  }, []);

  const openAppSettings = useCallback(() => {
    openSettings().catch(() => {
      Linking.openSettings();
    });
  }, []);

  return {
    status,
    isGranted: status === 'granted',
    isBlocked: status === 'blocked',
    requestPermissions,
    openAppSettings,
  };
};
