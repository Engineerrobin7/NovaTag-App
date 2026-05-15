/**
 * NovaTag BLE Constants
 * ─────────────────────────────────────────────────────────────────────────────
 * All UUIDs and command payloads are PLACEHOLDERS.
 * Replace with actual values from NovaTag firmware specification.
 *
 * Nordic nRF52840 standard services are listed for reference.
 * Custom NovaTag services must be confirmed with the firmware team.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Device Identification ────────────────────────────────────────────────────
/** Local name prefix used to filter NovaTag devices during scan */
export const NOVATAG_LOCAL_NAME_PREFIX = 'NovaTag';

/** Manufacturer ID for InfyNova (placeholder — register with Bluetooth SIG) */
export const NOVATAG_MANUFACTURER_ID = 0xffff; // TODO: Replace with real InfyNova manufacturer ID

// ─── Standard BLE Service UUIDs ───────────────────────────────────────────────
export const STANDARD_SERVICES = {
  /** Generic Access Profile */
  GENERIC_ACCESS: '00001800-0000-1000-8000-00805f9b34fb',
  /** Generic Attribute Profile */
  GENERIC_ATTRIBUTE: '00001801-0000-1000-8000-00805f9b34fb',
  /** Device Information Service */
  DEVICE_INFORMATION: '0000180a-0000-1000-8000-00805f9b34fb',
  /** Battery Service */
  BATTERY: '0000180f-0000-1000-8000-00805f9b34fb',
} as const;

// ─── Standard BLE Characteristic UUIDs ───────────────────────────────────────
export const STANDARD_CHARACTERISTICS = {
  /** Device Name */
  DEVICE_NAME: '00002a00-0000-1000-8000-00805f9b34fb',
  /** Appearance */
  APPEARANCE: '00002a01-0000-1000-8000-00805f9b34fb',
  /** Manufacturer Name String */
  MANUFACTURER_NAME: '00002a29-0000-1000-8000-00805f9b34fb',
  /** Model Number String */
  MODEL_NUMBER: '00002a24-0000-1000-8000-00805f9b34fb',
  /** Serial Number String */
  SERIAL_NUMBER: '00002a25-0000-1000-8000-00805f9b34fb',
  /** Hardware Revision String */
  HARDWARE_REVISION: '00002a27-0000-1000-8000-00805f9b34fb',
  /** Firmware Revision String */
  FIRMWARE_REVISION: '00002a26-0000-1000-8000-00805f9b34fb',
  /** Software Revision String */
  SOFTWARE_REVISION: '00002a28-0000-1000-8000-00805f9b34fb',
  /** Battery Level (0–100%) */
  BATTERY_LEVEL: '00002a19-0000-1000-8000-00805f9b34fb',
} as const;

// ─── NovaTag Custom Service UUIDs (PLACEHOLDERS) ─────────────────────────────
/**
 * TODO: Replace all UUIDs below with actual values from NovaTag firmware spec.
 * These are randomly generated placeholders for development scaffolding.
 */
export const NOVATAG_SERVICES = {
  /** Primary NovaTag control service */
  CONTROL: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // TODO: Replace
  /** NovaTag notification/event service */
  NOTIFICATION: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', // TODO: Replace
  /** Nordic DFU service (for OTA firmware updates) */
  NORDIC_DFU: '0000fe59-0000-1000-8000-00805f9b34fb', // Standard Nordic DFU UUID
} as const;

// ─── NovaTag Custom Characteristic UUIDs (PLACEHOLDERS) ──────────────────────
export const NOVATAG_CHARACTERISTICS = {
  /** Ring/buzzer control characteristic */
  RING_CONTROL: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', // TODO: Replace
  /** Ring status notification characteristic */
  RING_STATUS: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', // TODO: Replace
  /** Button press notification characteristic */
  BUTTON_PRESS: 'cccccccc-cccc-cccc-cccc-cccccccccccc', // TODO: Replace
  /** LED control characteristic */
  LED_CONTROL: 'dddddddd-dddd-dddd-dddd-dddddddddddd', // TODO: Replace
} as const;

// ─── Command Payloads (PLACEHOLDERS) ─────────────────────────────────────────
/**
 * TODO: Replace with actual command byte sequences from NovaTag firmware spec.
 * Values are base64-encoded byte arrays.
 */
export const NOVATAG_COMMANDS = {
  /** Start ringing the buzzer */
  RING_START: 'AQ==', // TODO: Replace — currently encodes [0x01]
  /** Stop ringing the buzzer */
  RING_STOP: 'AA==',  // TODO: Replace — currently encodes [0x00]
  /** LED blink pattern */
  LED_BLINK: 'Ag==',  // TODO: Replace — currently encodes [0x02]
} as const;

// ─── Scan Configuration ───────────────────────────────────────────────────────
export const SCAN_CONFIG = {
  /** Scan timeout in milliseconds */
  TIMEOUT_MS: 15000,
  /** Minimum RSSI to show device in scan results */
  MIN_RSSI: -100,
  /** RSSI thresholds for proximity display */
  RSSI_THRESHOLDS: {
    VERY_CLOSE: -55,
    NEARBY: -70,
    FAR: -85,
    WEAK: -100,
  },
} as const;

// ─── Connection Configuration ─────────────────────────────────────────────────
export const CONNECTION_CONFIG = {
  /** Connection timeout in milliseconds */
  TIMEOUT_MS: 10000,
  /** Auto-reconnect attempts */
  MAX_RECONNECT_ATTEMPTS: 3,
  /** Delay between reconnect attempts in milliseconds */
  RECONNECT_DELAY_MS: 2000,
  /** RSSI monitor interval in milliseconds */
  RSSI_MONITOR_INTERVAL_MS: 1000,
} as const;

// ─── Service UUIDs to scan for ────────────────────────────────────────────────
/**
 * UUIDs to filter during BLE scan.
 * Set to null to scan all devices and filter by name instead.
 * TODO: Add NOVATAG_SERVICES.CONTROL once UUID is confirmed.
 */
export const SCAN_SERVICE_UUIDS: string[] | null = null;
