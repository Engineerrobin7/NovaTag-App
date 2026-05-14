import { BleManager, Device, Characteristic } from "react-native-ble-plx";
import { Platform, PermissionsAndroid } from "react-native";

class BLEService {
  manager: BleManager;
  connectedDevices: Map<string, Device> = new Map();

  constructor() {
    this.manager = new BleManager();
  }

  async requestPermissions() {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    }
  }

  startDeviceScan(onDeviceFound: (device: Device) => void) {
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Scan error:", error);
        return;
      }
      if (device && device.name?.includes("NovaTag")) {
        onDeviceFound(device);
      }
    });
  }

  stopDeviceScan() {
    this.manager.stopDeviceScan();
  }

  async connectToDevice(deviceId: string): Promise<Device> {
    try {
      const device = await this.manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      this.connectedDevices.set(deviceId, device);
      
      // Setup disconnection listener
      device.onDisconnected((error, disconnectedDevice) => {
        this.connectedDevices.delete(disconnectedDevice.id);
        console.warn(`Device ${disconnectedDevice.id} disconnected`);
      });

      return device;
    } catch (error) {
      console.error("Connection error:", error);
      throw error;
    }
  }

  async readBatteryLevel(deviceId: string): Promise<number> {
    const device = this.connectedDevices.get(deviceId);
    if (!device) throw new Error("Device not connected");

    // Replace with actual NovaTag Service/Characteristic UUIDs
    const batteryChar = await device.readCharacteristicForService(
      "180F", // Battery Service
      "2A19"  // Battery Level Characteristic
    );
    
    // BLE characteristic values are base64-encoded; decode to get the uint8 battery %
    if (!batteryChar.value) return 0;
    const bytes = Buffer.from(batteryChar.value, "base64");
    return bytes.readUInt8(0);
  }

  async triggerBuzzer(deviceId: string, active: boolean) {
    const device = this.connectedDevices.get(deviceId);
    if (!device) throw new Error("Device not connected");

    // Example UUIDs for NovaTag buzzer control
    const controlService = "0000ff00-0000-1000-8000-00805f9b34fb";
    const buzzerChar = "0000ff01-0000-1000-8000-00805f9b34fb";

    await device.writeCharacteristicWithResponseForService(
      controlService,
      buzzerChar,
      active ? "AQ==" : "AA==" // Base64 for 1 and 0
    );
  }
}

export const bleService = new BLEService();
