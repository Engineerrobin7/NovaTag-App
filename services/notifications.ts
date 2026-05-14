import * as Notifications from "expo-notifications";

export const notificationService = {
  requestPermissions: async () => {
    const settings = await Notifications.requestPermissionsAsync();
    return settings.granted;
  },
  scheduleLocalNotification: async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger: null
    });
  },
  handleForeground: () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }
};
