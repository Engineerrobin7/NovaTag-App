import { logEvent } from "firebase/analytics";
import { analytics } from "./firebase";

export const analyticsService = {
  logEvent: (name: string, params?: Record<string, any>) => {
    if (!analytics) return;
    try {
      logEvent(analytics, name, params || {});
    } catch (error) {
      console.warn("Analytics error", error);
    }
  }
};
