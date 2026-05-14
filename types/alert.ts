export type SmartAlert = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: "battery" | "security" | "motion" | "geofence" | "network";
  active: boolean;
};
