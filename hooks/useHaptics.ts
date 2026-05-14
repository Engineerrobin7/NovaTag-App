import * as Haptics from "expo-haptics";

export const useHaptics = () => ({
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  impact: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
});
