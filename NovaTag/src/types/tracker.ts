/**
 * Core tracker types for NovaTag
 */

export type ConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'error';

export type ProximityLevel =
  | 'very_close'
  | 'nearby'
  | 'far'
  | 'weak'
  | 'disconnected';

export interface TrackerMetadata {
  /** User-assigned name */
  customName: string;
  /** ISO timestamp of last successful connection */
  lastConnected: string | null;
  /** ISO timestamp of last disconnection */
  lastDisconnected: string | null;
  /** Last known RSSI value */
  lastRssi: number | null;
  /** ISO timestamp of last seen (connected or advertisement) */
  lastSeen: string | null;
}

export interface SavedTracker {
  /** BLE device identifier (platform-specific) */
  id: string;
  /** Advertised BLE local name */
  advertisedName: string;
  /** User-assigned custom name */
  customName: string;
  /** ISO timestamp of when the tracker was paired */
  pairedAt: string;
  /** Last known metadata */
  metadata: TrackerMetadata;
}

export interface LiveTrackerState {
  /** Tracker ID (matches SavedTracker.id) */
  id: string;
  /** Current BLE connection state */
  connectionState: ConnectionState;
  /** Current RSSI (null if disconnected) */
  rssi: number | null;
  /** Battery level 0–100 (null if unavailable) */
  batteryLevel: number | null;
  /** Firmware version string (null if unavailable) */
  firmwareVersion: string | null;
  /** Hardware revision string (null if unavailable) */
  hardwareRevision: string | null;
  /** Manufacturer name (null if unavailable) */
  manufacturerName: string | null;
  /** Whether the tracker is currently ringing */
  isRinging: boolean;
  /** Whether a ring command is in progress */
  isRingLoading: boolean;
  /** Error message if last operation failed */
  error: string | null;
}

export interface ScannedDevice {
  /** BLE device identifier */
  id: string;
  /** Advertised local name */
  name: string | null;
  /** Current RSSI */
  rssi: number | null;
  /** Whether this device is already saved/paired */
  isAlreadyPaired: boolean;
  /** Raw manufacturer data (hex string) */
  manufacturerData: string | null;
  /** Advertised service UUIDs */
  serviceUUIDs: string[] | null;
}

export interface DeviceInformation {
  manufacturerName: string | null;
  modelNumber: string | null;
  serialNumber: string | null;
  hardwareRevision: string | null;
  firmwareRevision: string | null;
  softwareRevision: string | null;
}
