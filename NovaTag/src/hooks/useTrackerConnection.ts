import { useCallback } from 'react';
import { useTrackerStore } from '@store/trackerStore';
import { getActiveBleService } from '@services/ble/bleProvider';
import type { ConnectionState } from '@/types/tracker';

interface UseTrackerConnection {
  connect: (trackerId: string) => Promise<void>;
  disconnect: (trackerId: string) => Promise<void>;
  ring: (trackerId: string) => Promise<void>;
  stopRing: (trackerId: string) => Promise<void>;
  refreshStatus: (trackerId: string) => Promise<void>;
  connectionState: (trackerId: string) => ConnectionState;
}

export const useTrackerConnection = (): UseTrackerConnection => {
  const store = useTrackerStore();

  const connect = useCallback(async (trackerId: string) => {
    store.setConnectionState(trackerId, 'connecting');
    store.setError(trackerId, null);

    try {
      await getActiveBleService().connectToDevice(trackerId, (id, error) => {
        store.setConnectionState(id, 'disconnected');
        store.updateTrackerMetadata(id, {
          lastDisconnected: new Date().toISOString(),
        });
        if (error) {
          store.setError(id, error.message ?? 'Disconnected unexpectedly');
        }
      });

      store.setConnectionState(trackerId, 'connected');
      store.updateTrackerMetadata(trackerId, {
        lastConnected: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
      });

      // Read device info after connecting
      const ble = getActiveBleService();
      const [battery, info] = await Promise.allSettled([
        ble.readBatteryLevel(trackerId),
        ble.readDeviceInformation(trackerId),
      ]);

      if (battery.status === 'fulfilled' && battery.value !== null) {
        store.setBatteryLevel(trackerId, battery.value);
      }
      if (info.status === 'fulfilled') {
        store.setDeviceInfo(trackerId, {
          firmwareVersion: info.value.firmwareRevision,
          hardwareRevision: info.value.hardwareRevision,
          manufacturerName: info.value.manufacturerName,
        });
      }

      // Start RSSI monitoring
      ble.startRssiMonitor(
        trackerId,
        (rssi) => {
          store.setRssi(trackerId, rssi);
          store.updateTrackerMetadata(trackerId, {
            lastRssi: rssi,
            lastSeen: new Date().toISOString(),
          });
        },
        (error) => {
          store.setError(trackerId, error.message);
        },
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Connection failed';
      store.setConnectionState(trackerId, 'error');
      store.setError(trackerId, msg);
    }
  }, [store]);

  const disconnect = useCallback(async (trackerId: string) => {
    store.setConnectionState(trackerId, 'disconnecting');
    try {
      getActiveBleService().stopRssiMonitor(trackerId);
      await getActiveBleService().disconnectFromDevice(trackerId);
      store.setConnectionState(trackerId, 'disconnected');
      store.updateTrackerMetadata(trackerId, {
        lastDisconnected: new Date().toISOString(),
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Disconnect failed';
      store.setConnectionState(trackerId, 'disconnected');
      store.setError(trackerId, msg);
    }
  }, [store]);

  const ring = useCallback(async (trackerId: string) => {
    store.setRingLoading(trackerId, true);
    store.setError(trackerId, null);
    try {
      await getActiveBleService().sendRingCommand(trackerId);
      store.setRinging(trackerId, true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ring command failed';
      store.setError(trackerId, msg);
    } finally {
      store.setRingLoading(trackerId, false);
    }
  }, [store]);

  const stopRing = useCallback(async (trackerId: string) => {
    store.setRingLoading(trackerId, true);
    try {
      await getActiveBleService().sendStopRingCommand(trackerId);
      store.setRinging(trackerId, false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Stop ring failed';
      store.setError(trackerId, msg);
    } finally {
      store.setRingLoading(trackerId, false);
    }
  }, [store]);

  const refreshStatus = useCallback(async (trackerId: string) => {
    const ble = getActiveBleService();
    if (!ble.isConnected(trackerId)) return;
    try {
      const battery = await ble.readBatteryLevel(trackerId);
      if (battery !== null) store.setBatteryLevel(trackerId, battery);
    } catch {}
  }, [store]);

  const connectionState = useCallback(
    (trackerId: string): ConnectionState => {
      return store.liveStates[trackerId]?.connectionState ?? 'disconnected';
    },
    [store.liveStates],
  );

  return { connect, disconnect, ring, stopRing, refreshStatus, connectionState };
};
