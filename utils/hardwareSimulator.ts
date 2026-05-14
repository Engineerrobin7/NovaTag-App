import { useDeviceStore } from "@store/useDeviceStore";

/**
 * HardwareSimulator
 * Simulates real-time telemetry from NovaTag devices for testing
 * and demonstration without physical hardware.
 */
class HardwareSimulator {
  private interval: ReturnType<typeof setInterval> | null = null;

  startSimulation() {
    if (this.interval) return;

    this.interval = setInterval(() => {
      const { devices, updateDevice } = useDeviceStore.getState();
      
      devices.forEach(device => {
        // Only simulate devices that are "nearby"
        if (device.status === "nearby") {
          // Slightly fluctuate battery
          const batteryDrop = Math.random() > 0.95 ? 1 : 0;
          const newBattery = Math.max(0, device.battery - batteryDrop);
          
          // Randomly change "lastSeen" status
          const lastSeenOptions = ["Just now", "1m ago", "2m ago"];
          const newLastSeen = lastSeenOptions[Math.floor(Math.random() * lastSeenOptions.length)];

          updateDevice(device.id, {
            battery: newBattery,
            lastSeen: newLastSeen,
          });
        }
      });
    }, 5000);
  }

  stopSimulation() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Simulates the precision finding distance
   * @param targetId Device ID to find
   * @param onUpdate Callback with new distance and signal
   */
  simulatePrecisionFind(targetId: string, onUpdate: (distance: number, signal: number) => void) {
    let distance = 15.0;
    const findInterval = setInterval(() => {
      // Move closer with some jitter
      const movement = Math.random() * 0.5;
      distance = Math.max(0, distance - movement + (Math.random() * 0.1));
      
      // Signal strength (RSSI) typically ranges from -30 (close) to -100 (far)
      const signal = -30 - (distance * 4) + (Math.random() * 5);
      
      onUpdate(parseFloat(distance.toFixed(1)), Math.floor(signal));

      if (distance <= 0.2) {
        clearInterval(findInterval);
      }
    }, 800);

    return () => clearInterval(findInterval);
  }
}

export const hardwareSimulator = new HardwareSimulator();
