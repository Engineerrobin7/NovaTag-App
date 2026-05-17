import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useDeviceStore } from '@store/useDeviceStore';

const GEOFENCE_TASK_NAME = 'GEOFENCE_TASK';

// Define the task for background geofencing
TaskManager.defineTask(GEOFENCE_TASK_NAME, ({ data: { eventType, region }, error }) => {
  if (error) {
    console.error('Geofencing error:', error);
    return;
  }

  const { devices } = useDeviceStore.getState();

  if (eventType === Location.GeofencingEventType.Exit) {
    console.log(`Device left region: ${region.identifier}`);
    
    // Find the device that has this safe zone
    const device = devices.find(d => d.safeZones?.some(z => z.id === region.identifier));
    
    if (device) {
      console.log(`ALERT: ${device.name} left a safe zone!`);
      // In production, trigger a local notification or push notification
      // example: Notifications.scheduleNotificationAsync(...)
    }
  } else if (eventType === Location.GeofencingEventType.Enter) {
    console.log(`Device entered region: ${region.identifier}`);
  }
});

/**
 * Starts geofencing for a list of regions.
 * Stops existing geofencing for the task first.
 */
export const startGeofencing = async (regions: Location.LocationRegion[]) => {
  try {
    const hasStarted = await Location.hasStartedGeofencingAsync(GEOFENCE_TASK_NAME);
    if (hasStarted) {
      await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
    }
    
    if (regions.length === 0) return;

    await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, regions);
    console.log(`Started geofencing for ${regions.length} regions`);
  } catch (error) {
    console.error('Failed to start geofencing:', error);
  }
};

/**
 * Helper to extract all safe zones from all devices and register them.
 */
export const syncGeofencesWithStore = async () => {
  const { devices } = useDeviceStore.getState();
  const regions: Location.LocationRegion[] = [];

  devices.forEach(device => {
    device.safeZones?.forEach(zone => {
      if (zone.enabled) {
        regions.push({
          identifier: zone.id,
          latitude: zone.center.latitude,
          longitude: zone.center.longitude,
          radius: zone.radius,
          notifyOnEnter: true,
          notifyOnExit: true,
        });
      }
    });
  });

  await startGeofencing(regions);
};
