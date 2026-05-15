/**
 * BLE Service Tests
 * Tests the mock BLE service and proximity logic.
 */
import { mockBleService, MOCK_DEVICES } from '../services/ble/mockBleService';
import { rssiToProximity } from '../hooks/useFindTracker';

describe('MockBLEService', () => {
  afterEach(() => {
    mockBleService.destroy();
  });

  it('returns PoweredOn state', async () => {
    const state = await mockBleService.getState();
    expect(state).toBe('PoweredOn');
  });

  it('discovers mock devices during scan', (done) => {
    const found: string[] = [];
    mockBleService.startDeviceScan(
      (device) => {
        found.push(device.id);
        if (found.length === MOCK_DEVICES.length) {
          mockBleService.stopDeviceScan();
          expect(found).toHaveLength(MOCK_DEVICES.length);
          done();
        }
      },
      () => done(new Error('Scan error')),
    );
  }, 10000);

  it('connects to a mock device', async () => {
    const device = await mockBleService.connectToDevice(
      'mock-novatag-001',
      () => {},
    );
    expect(device.id).toBe('mock-novatag-001');
    expect(mockBleService.isConnected('mock-novatag-001')).toBe(true);
  });

  it('disconnects from a mock device', async () => {
    await mockBleService.connectToDevice('mock-novatag-001', () => {});
    await mockBleService.disconnectFromDevice('mock-novatag-001');
    expect(mockBleService.isConnected('mock-novatag-001')).toBe(false);
  });

  it('reads battery level', async () => {
    await mockBleService.connectToDevice('mock-novatag-001', () => {});
    const battery = await mockBleService.readBatteryLevel('mock-novatag-001');
    expect(battery).toBeGreaterThanOrEqual(0);
    expect(battery).toBeLessThanOrEqual(100);
  });

  it('reads device information', async () => {
    await mockBleService.connectToDevice('mock-novatag-001', () => {});
    const info = await mockBleService.readDeviceInformation('mock-novatag-001');
    expect(info.manufacturerName).toBe('InfyNova');
    expect(info.firmwareRevision).toBeDefined();
  });

  it('sends ring command without error', async () => {
    await mockBleService.connectToDevice('mock-novatag-001', () => {});
    await expect(
      mockBleService.sendRingCommand('mock-novatag-001'),
    ).resolves.not.toThrow();
  });

  it('sends stop ring command without error', async () => {
    await mockBleService.connectToDevice('mock-novatag-001', () => {});
    await mockBleService.sendRingCommand('mock-novatag-001');
    await expect(
      mockBleService.sendStopRingCommand('mock-novatag-001'),
    ).resolves.not.toThrow();
  });

  it('marks already-paired devices in scan', (done) => {
    const pairedIds = ['mock-novatag-001'];
    let checked = false;
    mockBleService.startDeviceScan(
      (device) => {
        if (device.id === 'mock-novatag-001' && !checked) {
          checked = true;
          expect(device.isAlreadyPaired).toBe(true);
          mockBleService.stopDeviceScan();
          done();
        }
      },
      () => done(new Error('Scan error')),
      pairedIds,
    );
  }, 10000);
});

describe('rssiToProximity', () => {
  it('returns very_close for strong signal', () => {
    expect(rssiToProximity(-40)).toBe('very_close');
    expect(rssiToProximity(-55)).toBe('very_close');
  });

  it('returns nearby for medium signal', () => {
    expect(rssiToProximity(-60)).toBe('nearby');
    expect(rssiToProximity(-70)).toBe('nearby');
  });

  it('returns far for weak signal', () => {
    expect(rssiToProximity(-75)).toBe('far');
    expect(rssiToProximity(-85)).toBe('far');
  });

  it('returns weak for very weak signal', () => {
    expect(rssiToProximity(-90)).toBe('weak');
    expect(rssiToProximity(-99)).toBe('weak');
  });

  it('returns disconnected for null', () => {
    expect(rssiToProximity(null)).toBe('disconnected');
  });

  it('returns disconnected for extremely weak signal', () => {
    expect(rssiToProximity(-105)).toBe('disconnected');
  });
});
