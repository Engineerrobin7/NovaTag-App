/**
 * Tracker Store Tests
 */
import { useTrackerStore } from '../store/trackerStore';
import type { SavedTracker } from '../types/tracker';

const mockTracker: SavedTracker = {
  id: 'test-001',
  advertisedName: 'NovaTag-001',
  customName: 'My Keys',
  pairedAt: new Date().toISOString(),
  metadata: {
    customName: 'My Keys',
    lastConnected: null,
    lastDisconnected: null,
    lastRssi: null,
    lastSeen: null,
  },
};

describe('TrackerStore', () => {
  beforeEach(() => {
    // Reset store state
    useTrackerStore.setState({ savedTrackers: [], liveStates: {} });
  });

  it('adds a tracker', () => {
    useTrackerStore.getState().addTracker(mockTracker);
    const { savedTrackers } = useTrackerStore.getState();
    expect(savedTrackers).toHaveLength(1);
    expect(savedTrackers[0].id).toBe('test-001');
  });

  it('does not add duplicate trackers', () => {
    useTrackerStore.getState().addTracker(mockTracker);
    useTrackerStore.getState().addTracker(mockTracker);
    expect(useTrackerStore.getState().savedTrackers).toHaveLength(1);
  });

  it('removes a tracker', () => {
    useTrackerStore.getState().addTracker(mockTracker);
    useTrackerStore.getState().removeTracker('test-001');
    expect(useTrackerStore.getState().savedTrackers).toHaveLength(0);
  });

  it('renames a tracker', () => {
    useTrackerStore.getState().addTracker(mockTracker);
    useTrackerStore.getState().renameTracker('test-001', 'House Keys');
    const tracker = useTrackerStore.getState().savedTrackers[0];
    expect(tracker.customName).toBe('House Keys');
    expect(tracker.metadata.customName).toBe('House Keys');
  });

  it('initializes live state', () => {
    useTrackerStore.getState().initLiveState('test-001');
    const live = useTrackerStore.getState().liveStates['test-001'];
    expect(live).toBeDefined();
    expect(live.connectionState).toBe('disconnected');
    expect(live.rssi).toBeNull();
    expect(live.batteryLevel).toBeNull();
  });

  it('updates connection state', () => {
    useTrackerStore.getState().setConnectionState('test-001', 'connected');
    expect(useTrackerStore.getState().liveStates['test-001'].connectionState).toBe('connected');
  });

  it('clears rssi on disconnect', () => {
    useTrackerStore.getState().setRssi('test-001', -60);
    useTrackerStore.getState().setConnectionState('test-001', 'disconnected');
    expect(useTrackerStore.getState().liveStates['test-001'].rssi).toBeNull();
  });

  it('sets battery level', () => {
    useTrackerStore.getState().setBatteryLevel('test-001', 85);
    expect(useTrackerStore.getState().liveStates['test-001'].batteryLevel).toBe(85);
  });

  it('sets ringing state', () => {
    useTrackerStore.getState().setRinging('test-001', true);
    expect(useTrackerStore.getState().liveStates['test-001'].isRinging).toBe(true);
  });

  it('clears live state on disconnect', () => {
    useTrackerStore.getState().setRinging('test-001', true);
    useTrackerStore.getState().setConnectionState('test-001', 'disconnected');
    expect(useTrackerStore.getState().liveStates['test-001'].isRinging).toBe(false);
  });

  it('updates tracker metadata', () => {
    useTrackerStore.getState().addTracker(mockTracker);
    const now = new Date().toISOString();
    useTrackerStore.getState().updateTrackerMetadata('test-001', {
      lastConnected: now,
      lastRssi: -65,
    });
    const tracker = useTrackerStore.getState().savedTrackers[0];
    expect(tracker.metadata.lastConnected).toBe(now);
    expect(tracker.metadata.lastRssi).toBe(-65);
  });
});
