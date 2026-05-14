import { useEffect, useState } from "react";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export function usePermissions() {
  const [status, setStatus] = useState({
    bluetooth: false,
    location: false,
    notifications: false,
    background: false
  });

  useEffect(() => {
    async function requestAll() {
      const location = await Location.requestForegroundPermissionsAsync();
      const background = await Location.requestBackgroundPermissionsAsync();
      const notification = await Notifications.requestPermissionsAsync();
      setStatus({
        bluetooth: Platform.OS === "ios" ? true : false,
        location: location.status === "granted",
        notifications: notification.granted,
        background: background.status === "granted"
      });
    }
    requestAll();
  }, []);

  return status;
}
