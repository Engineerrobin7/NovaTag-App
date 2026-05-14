import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useToastStore } from "@store/useToastStore";

const GEOFENCE_TASK_NAME = "DEVICE_SAFE_ZONE_MONITOR";

export class GeofenceService {
  static async registerGeofence(deviceId: string, zones: any[]) {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Background location permission denied");
      return;
    }

    const regions = zones.map(zone => ({
      identifier: `${deviceId}_${zone.id}`,
      latitude: zone.center.latitude,
      longitude: zone.center.longitude,
      radius: zone.radius,
      notifyOnEnter: zone.type === "entry" || zone.type === "both",
      notifyOnExit: zone.type === "exit" || zone.type === "both",
    }));

    await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, regions);
  }

  static async stopMonitoring() {
    await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
  }
}

// Define the background task
TaskManager.defineTask(GEOFENCE_TASK_NAME, async ({ data: { eventType, region }, error }: any) => {
  if (error) {
    console.error("Geofence task error:", error);
    return;
  }

  if (eventType === Location.GeofencingEventType.Exit) {
    console.log("Device exited safe zone:", region.identifier);
  }
});
