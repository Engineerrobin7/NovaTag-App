/**
 * NovaTag BLE Service
 * ─────────────────────────────────────────────────────────────────────────────
 * Abstracts all react-native-ble-plx operations.
 * All UUIDs and command payloads are sourced from @constants/ble.
 *
 * Replace placeholder UUIDs in src/constants/ble.ts when firmware is finalized.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import {
  BleManager,
  Device,
  State as BleState,
  BleError,
  Characteristic,
  Subscription,
} from 'react-native-ble-plx';
import { Platform } from 'react-native';
import {
  NOVATAG_LOCAL_NAME_PREFIX,
  SCAN_SERVICE_UUIDS,
  SCAN_CONFIG,
  CONNECTION_CONFIG,
  STANDARD_SERVICES,
  STANDARD_CHARACTERISTICS,
  NOVATAG_SERVICES,
  NOVATAG_CHARACTERISTICS,
  NOVATAG_COMMANDS,
} from '@constants/ble';
import type { ScannedDevice, DeviceInformation } from '@/types/tracker';

export type BleStateChangeCallback = (state: BleState) => void;
export type DeviceFoundCallback = (device: ScannedDevice) => void;
export type DisconnectCallback = (deviceId: string, error: BleError | null) => void;

class BLEService {
  private manager: BleManager;
  private connectedDevices: Map<string, Device> = new Map();
  private rssiSubscriptions: Map<string, ReturnType<typeof setInterval>> = new Map();
  private notificationSubscriptions: Map<string, Subscription> = new Map();
  private stateSubscription: Subscription | null = null;
  private disconnectCallbacks: Map<string, DisconnectCallback> = new Map();

  constructor() {
    this.manager = new BleManager();
  }

  // ─── State ─────────────────────────────────────────────────────────────────

  async getState(): Promise<BleState> {
    return this.manager.state();
  }

  onStateChange(callback: BleStateChangeCallback): () => void {
    const sub = this.manager.onStateChange(callback, true);
    return () => sub.remove();
  }

  // ─── Permissions ───────────────────────────────────────────────────────────

  async enable(): Promise<void> {
    if (Platform.OS === 'android') {
      await this.manager.enable();
    }
  }

  // ─── Scanning ──────────────────────────────────────────────────────────────

  startDeviceScan(
    onDeviceFound: DeviceFoundCallback,
    onError: (error: BleError) => void,
    pairedIds: string[] = [],
  ): void {
    this.manager.startDeviceScan(
      SCAN_SERVICE_UUIDS,
      { allowDuplicates: true },
      (error, device) => {
        if (error) {
          onError(error);
          return;
        }
        if (!device) return;

        // Filter: only show NovaTag devices
        const isNovaTag =
          device.localName?.startsWith(NOVATAG_LOCAL_NAME_PREFIX) ||
          device.name?.startsWith(NOVATAG_LOCAL_NAME_PREFIX);

        if (!isNovaTag) return;
        if ((device.rssi ?? -999) < SCAN_CONFIG.MIN_RSSI) return;

        const scanned: ScannedDevice = {
          id: device.id,
          name: device.localName ?? device.name ?? null,
          rssi: device.rssi ?? null,
          isAlreadyPaired: pairedIds.includes(device.id),
          manufacturerData: device.manufacturerData ?? null,
          serviceUUIDs: device.serviceUUIDs ?? null,
        };

        onDeviceFound(scanned);
      },
    );

    // Auto-stop after timeout
    setTimeout(() => {
      this.stopDeviceScan();
    }, SCAN_CONFIG.TIMEOUT_MS);
  }

  stopDeviceScan(): void {
    this.manager.stopDeviceScan();
  }

  // ─── Connection ────────────────────────────────────────────────────────────

  async connectToDevice(
    deviceId: string,
    onDisconnect: DisconnectCallback,
  ): Promise<Device> {
    const device = await this.manager.connectToDevice(deviceId, {
      timeout: CONNECTION_CONFIG.TIMEOUT_MS,
      autoConnect: false,
    });

    await device.discoverAllServicesAndCharacteristics();
    this.connectedDevices.set(deviceId, device);
    this.disconnectCallbacks.set(deviceId, onDisconnect);

    // Monitor disconnection
    device.onDisconnected((error, disconnectedDevice) => {
      const id = disconnectedDevice?.id ?? deviceId;
      this.connectedDevices.delete(id);
      this.stopRssiMonitor(id);
      const cb = this.disconnectCallbacks.get(id);
      if (cb) {
        cb(id, error);
        this.disconnectCallbacks.delete(id);
      }
    });

    return device;
  }

  async disconnectFromDevice(deviceId: string): Promise<void> {
    this.stopRssiMonitor(deviceId);
    this.removeNotificationSubscription(deviceId);
    await this.manager.cancelDeviceConnection(deviceId);
    this.connectedDevices.delete(deviceId);
  }

  isConnected(deviceId: string): boolean {
    return this.connectedDevices.has(deviceId);
  }

  getConnectedDevice(deviceId: string): Device | undefined {
    return this.connectedDevices.get(deviceId);
  }

  // ─── RSSI Monitoring ───────────────────────────────────────────────────────

  startRssiMonitor(
    deviceId: string,
    onRssi: (rssi: number) => void,
    onError?: (error: Error) => void,
  ): void {
    this.stopRssiMonitor(deviceId);

    const interval = setInterval(async () => {
      const device = this.connectedDevices.get(deviceId);
      if (!device) {
        this.stopRssiMonitor(deviceId);
        return;
      }
      try {
        const updated = await device.readRSSI();
        if (updated.rssi !== null) {
          onRssi(updated.rssi);
        }
      } catch (e) {
        onError?.(e as Error);
      }
    }, CONNECTION_CONFIG.RSSI_MONITOR_INTERVAL_MS);

    this.rssiSubscriptions.set(deviceId, interval);
  }

  stopRssiMonitor(deviceId: string): void {
    const interval = this.rssiSubscriptions.get(deviceId);
    if (interval) {
      clearInterval(interval);
      this.rssiSubscriptions.delete(deviceId);
    }
  }

  // ─── Battery ───────────────────────────────────────────────────────────────

  async readBatteryLevel(deviceId: string): Promise<number | null> {
    const device = this.connectedDevices.get(deviceId);
    if (!device) throw new Error('Device not connected');

    try {
      const char = await device.readCharacteristicForService(
        STANDARD_SERVICES.BATTERY,
        STANDARD_CHARACTERISTICS.BATTERY_LEVEL,
      );
      if (!char.value) return null;
      // BLE battery level is a single uint8 byte, base64-encoded
      const bytes = Buffer.from(char.value, 'base64');
      return bytes.readUInt8(0);
    } catch {
      return null;
    }
  }

  // ─── Device Information ────────────────────────────────────────────────────

  async readDeviceInformation(deviceId: string): Promise<DeviceInformation> {
    const device = this.connectedDevices.get(deviceId);
    if (!device) throw new Error('Device not connected');

    const readChar = async (charUUID: string): Promise<string | null> => {
      try {
        const char = await device.readCharacteristicForService(
          STANDARD_SERVICES.DEVICE_INFORMATION,
          charUUID,
        );
        if (!char.value) return null;
        return Buffer.from(char.value, 'base64').toString('utf-8');
      } catch {
        return null;
      }
    };

    const [
      manufacturerName,
      modelNumber,
      serialNumber,
      hardwareRevision,
      firmwareRevision,
      softwareRevision,
    ] = await Promise.all([
      readChar(STANDARD_CHARACTERISTICS.MANUFACTURER_NAME),
      readChar(STANDARD_CHARACTERISTICS.MODEL_NUMBER),
      readChar(STANDARD_CHARACTERISTICS.SERIAL_NUMBER),
      readChar(STANDARD_CHARACTERISTICS.HARDWARE_REVISION),
      readChar(STANDARD_CHARACTERISTICS.FIRMWARE_REVISION),
      readChar(STANDARD_CHARACTERISTICS.SOFTWARE_REVISION),
    ]);

    return {
      manufacturerName,
      modelNumber,
      serialNumber,
      hardwareRevision,
      firmwareRevision,
      softwareRevision,
    };
  }

  // ─── Ring Commands ─────────────────────────────────────────────────────────

  async sendRingCommand(deviceId: string): Promise<void> {
    await this.writeCharacteristic(
      deviceId,
      NOVATAG_SERVICES.CONTROL,
      NOVATAG_CHARACTERISTICS.RING_CONTROL,
      NOVATAG_COMMANDS.RING_START,
    );
  }

  async sendStopRingCommand(deviceId: string): Promise<void> {
    await this.writeCharacteristic(
      deviceId,
      NOVATAG_SERVICES.CONTROL,
      NOVATAG_CHARACTERISTICS.RING_CONTROL,
      NOVATAG_COMMANDS.RING_STOP,
    );
  }

  // ─── Notifications ─────────────────────────────────────────────────────────

  subscribeToNotifications(
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string,
    onNotification: (char: Characteristic) => void,
    onError?: (error: BleError) => void,
  ): void {
    const key = `${deviceId}:${characteristicUUID}`;
    this.removeNotificationSubscription(key);

    const device = this.connectedDevices.get(deviceId);
    if (!device) return;

    const sub = device.monitorCharacteristicForService(
      serviceUUID,
      characteristicUUID,
      (error, char) => {
        if (error) {
          onError?.(error);
          return;
        }
        if (char) onNotification(char);
      },
    );

    this.notificationSubscriptions.set(key, sub);
  }

  removeNotificationSubscription(key: string): void {
    const sub = this.notificationSubscriptions.get(key);
    if (sub) {
      sub.remove();
      this.notificationSubscriptions.delete(key);
    }
  }

  // ─── Discover Services ─────────────────────────────────────────────────────

  async discoverServices(deviceId: string): Promise<string[]> {
    const device = this.connectedDevices.get(deviceId);
    if (!device) throw new Error('Device not connected');
    const services = await device.services();
    return services.map((s) => s.uuid);
  }

  async discoverCharacteristics(
    deviceId: string,
    serviceUUID: string,
  ): Promise<string[]> {
    const device = this.connectedDevices.get(deviceId);
    if (!device) throw new Error('Device not connected');
    const chars = await device.characteristicsForService(serviceUUID);
    return chars.map((c) => c.uuid);
  }

  // ─── Generic Read/Write ────────────────────────────────────────────────────

  async readCharacteristic(
    deviceId: string,
    serviceUUID: string,
    charUUID: string,
  ): Promise<string | null> {
    const device = this.connectedDevices.get(deviceId);
    if (!device) throw new Error('Device not connected');
    const char = await device.readCharacteristicForService(serviceUUID, charUUID);
    return char.value ?? null;
  }

  async writeCharacteristic(
    deviceId: string,
    serviceUUID: string,
    charUUID: string,
    value: string,
    withResponse = true,
  ): Promise<void> {
    const device = this.connectedDevices.get(deviceId);
    if (!device) throw new Error('Device not connected');

    if (withResponse) {
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        charUUID,
        value,
      );
    } else {
      await device.writeCharacteristicWithoutResponseForService(
        serviceUUID,
        charUUID,
        value,
      );
    }
  }

  // ─── Cleanup ───────────────────────────────────────────────────────────────

  destroy(): void {
    this.stateSubscription?.remove();
    this.rssiSubscriptions.forEach((interval) => clearInterval(interval));
    this.rssiSubscriptions.clear();
    this.notificationSubscriptions.forEach((sub) => sub.remove());
    this.notificationSubscriptions.clear();
    this.manager.destroy();
  }
}

// Singleton instance
export const bleService = new BLEService();
