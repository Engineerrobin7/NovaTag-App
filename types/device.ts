export type SafeZone = {
  id: string;
  name: string;
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number; // in meters
  type: "entry" | "exit" | "both";
  enabled: boolean;
};

export type NovaTagDevice = {
  id: string;
  name: string;
  icon: string;
  color?: string;
  battery: number;
  firmware: string;
  status: "nearby" | "away" | "offline" | "lost";
  lastSeen: string;
  lat?: number;
  lng?: number;
  location?: {
    latitude: number;
    longitude: number;
    label: string;
  };
  safeZones?: SafeZone[];
  sharedWith?: string[];
};
