/**
 * Mock BLE Service
 * ─────────────────────────────────────────────────────────────────────────────
 * Simulates NovaTag BLE behavior without real hardware.
 * Switch between mock and real mode via Settings > Developer > Mock Mode.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { ScannedDevice, DeviceInformation } from '@/types/tracker';

// ─── Mock Devices ─────────────────────────────────────────────────────────────
export const MOCK_DEVICES: ScannedDevice[] = [
  {
    id: 'mock-novatag-001',
    name: 'NovaTag-001',
    rssi: -52,
    isAlreadyPaired: false,
    manufacturerData: null,
    serviceUUIDs: null,
  },
  {
    id: 'mock-novatag-002',
    name: 'NovaTag-002',
    rssi: -71,
    isAlreadyPaired: false,
    manufacturerData: null,
    serviceUUIDs: null,
  },
  {
    id: 'mock-novatag-003',
    name: 'NovaTag-003',
    rssi: -88,
    isAlreadyPaired: false,
    manufacturerData: null,
    serviceUUIDs: null,
  },
];

export const MOCK_DEVICE_INFO: DeviceInformation = {
  manufacturerName: 'InfyNova',
  modelNumber: 'NT-1000',
  serialNumber: 'SN-MOCK-001',
  hardwareRevision: 'HW-1.0',
  firmwareRevision: 'FW-1.0.0',
  softwareRevision: 'SW-1.0.0',
};

// ─── Mock BLE Service ─────────────────────────────────────────────────────────
class MockBLEService {
  private connectedDevices: Set<string> = new Set();
  private rssiIntervals: Map<string, ReturnType<typeof setInterval>> = new Map();
  private ringTimeouts: Map<string, ReturnType<typeof setTimeout>> = new Map();

  async getState(): Promise<'PoweredOn'> {
    return 'PoweredOn';
  }

  onStateChange(callback: (state: string) => void): () => void {
    setTimeout(() => callback('PoweredOn'), 100);
    return () => {};
  }

  startDeviceScan(
    onDeviceFound: (device: ScannedDevice) => void,
    _onError: (error: Error) => void,
    pairedIds: string[] = [],
  ): void {
    // Simulate devices appearing over time
    MOCK_DEVICES.forEach((device, index) => {
      setTimeout(() => {
        onDeviceFound({
          ...device,
          isAlreadyPaired: pairedIds.includes(device.id),
          // Simulate RSSI fluctuation
          rssi: (device.rssi ?? -60) + Math.floor(Math.random() * 6 - 3),
        });
      }, 500 + index * 800);
    });
  }

  stopDeviceScan(): void {
    // No-op in mock
  }

  async connectToDevice(
    deviceId: string,
    _onDisconnect: (id: string, error: null) => void,
  ): Promise<{ id: string }> {
    await this.delay(1200); // Simulate connection time
    this.connectedDevices.add(deviceId);
    return { id: deviceId };
  }

  async disconnectFromDevice(deviceId: string): Promise<void> {
    await this.delay(300);
    this.connectedDevices.delete(deviceId);
    this.stopRssiMonitor(deviceId);
  }

  isConnected(deviceId: string): boolean {
    return this.connectedDevices.has(deviceId);
  }

  startRssiMonitor(
    deviceId: string,
    onRssi: (rssi: number) => void,
    _onError?: (error: Error) => void,
  ): void {
    this.stopRssiMonitor(deviceId);
    const baseRssi = -60;
    const interval = setInterval(() => {
      if (!this.connectedDevices.has(deviceId)) {
        this.stopRssiMonitor(deviceId);
        return;
      }
      // Simulate realistic RSSI fluctuation
      const rssi = baseRssi + Math.floor(Math.random() * 20 - 10);
      onRssi(rssi);
    }, 1000);
    this.rssiIntervals.set(deviceId, interval);
  }

  stopRssiMonitor(deviceId: string): void {
    const interval = this.rssiIntervals.get(deviceId);
    if (interval) {
      clearInterval(interval);
      this.rssiIntervals.delete(deviceId);
    }
  }

  async readBatteryLevel(_deviceId: string): Promise<number> {
    await this.delay(200);
    return 78; // Mock battery level
  }

  async readDeviceInformation(_deviceId: string): Promise<DeviceInformation> {
    await this.delay(300);
    return { ...MOCK_DEVICE_INFO };
  }

  async sendRingCommand(deviceId: string): Promise<void> {
    await this.delay(150);
    // Auto-stop ring after 5 seconds in mock
    const timeout = setTimeout(() => {
      this.ringTimeouts.delete(deviceId);
    }, 5000);
    this.ringTimeouts.set(deviceId, timeout);
  }

  async sendStopRingCommand(deviceId: string): Promise<void> {
    await this.delay(150);
    const timeout = this.ringTimeouts.get(deviceId);
    if (timeout) {
      clearTimeout(timeout);
      this.ringTimeouts.delete(deviceId);
    }
  }

  async discoverServices(_deviceId: string): Promise<string[]> {
    await this.delay(200);
    return [
      '0000180a-0000-1000-8000-00805f9b34fb',
      '0000180f-0000-1000-8000-00805f9b34fb',
    ];
  }

  async discoverCharacteristics(
    _deviceId: string,
    _serviceUUID: string,
  ): Promise<string[]> {
    await this.delay(100);
    return [
      '00002a19-0000-1000-8000-00805f9b34fb',
      '00002a26-0000-1000-8000-00805f9b34fb',
    ];
  }

  async readCharacteristic(
    _deviceId: string,
    _serviceUUID: string,
    _charUUID: string,
  ): Promise<string> {
    await this.delay(100);
    return btoa('mock_value');
  }

  async writeCharacteristic(
    _deviceId: string,
    _serviceUUID: string,
    _charUUID: string,
    _value: string,
  ): Promise<void> {
    await this.delay(100);
  }

  subscribeToNotifications(
    _deviceId: string,
    _serviceUUID: string,
    _charUUID: string,
    _onNotification: (data: unknown) => void,
    _onError?: (error: Error) => void,
  ): void {
    // No-op in mock
  }

  removeNotificationSubscription(_key: string): void {}

  destroy(): void {
    this.rssiIntervals.forEach((i) => clearInterval(i));
    this.rssiIntervals.clear();
    this.ringTimeouts.forEach((t) => clearTimeout(t));
    this.ringTimeouts.clear();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockBleService = new MockBLEService();
