import { create } from "zustand";
import { NovaTagDevice, SmartAlert, SafeZone } from "../types";
import { database } from "@services/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, addDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { syncGeofencesWithStore } from "@services/geofencingService";

type DeviceState = {
  devices: NovaTagDevice[];
  alerts: SmartAlert[];
  selectedDeviceId: string | null;
  isScanning: boolean;
  isLoading: boolean;
  
  // Actions
  setDevices: (devices: NovaTagDevice[]) => void;
  updateDevice: (id: string, updates: Partial<NovaTagDevice>) => void;
  addDevice: (device: NovaTagDevice) => void;
  removeDevice: (id: string) => void;
  
  setAlerts: (alerts: SmartAlert[]) => void;
  addAlert: (alert: SmartAlert) => void;
  clearAlerts: () => void;
  
  selectDevice: (id: string | null) => void;
  setScanning: (isScanning: boolean) => void;
  
  // Safe Zones
  addSafeZone: (deviceId: string, zone: SafeZone) => Promise<void>;
  removeSafeZone: (deviceId: string, zoneId: string) => Promise<void>;
  
  // Lost Mode
  toggleLostMode: (deviceId: string, isLost: boolean) => Promise<void>;
  
  // Firebase Sync
  syncWithFirebase: (userId: string) => () => void;
};

export const useDeviceStore = create<DeviceState>((set, get) => ({
  // Note: Initial devices kept for demo/development purposes. 
  // In production, this starts as an empty array.
  devices: [
    { id: "1", name: "Keys", battery: 87, status: "nearby", lastSeen: "Just now", icon: "key-variant", color: "bg-blue-500", lat: 51.5074, lng: -0.1278, firmware: "1.0.4" },
    { id: "2", name: "Backpack", battery: 42, status: "away", lastSeen: "2h ago", icon: "bag-personal", color: "bg-orange-500", lat: 51.5154, lng: -0.1410, firmware: "1.0.2" },
    { id: "3", name: "Wallet", battery: 91, status: "nearby", lastSeen: "5m ago", icon: "wallet", color: "bg-emerald-500", lat: 51.5014, lng: -0.1170, firmware: "1.0.4" }
  ],
  alerts: [],
  selectedDeviceId: null,
  isScanning: false,
  isLoading: false,

  setDevices: (devices) => set({ devices }),
  
  updateDevice: async (id, updates) => {
    // Local update for immediate UI feedback
    set((state) => ({
      devices: state.devices.map((d) => (d.id === id ? { ...d, ...updates } : d))
    }));
    
    // Remote update (optional: only if id is a real Firestore ID)
    try {
      const deviceRef = doc(database, "devices", id);
      await updateDoc(deviceRef, updates);
    } catch (e) {
      console.log("Device update skipped (not in Firestore):", id);
    }
  },

  addDevice: (device) => set((state) => ({
    devices: [...state.devices, device]
  })),

  removeDevice: async (id) => {
    set((state) => ({
      devices: state.devices.filter((d) => d.id !== id)
    }));
    
    try {
      await deleteDoc(doc(database, "devices", id));
    } catch (e) {
      console.log("Device deletion skipped (not in Firestore):", id);
    }
  },

  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) => set((state) => ({
    alerts: [alert, ...state.alerts]
  })),
  clearAlerts: () => set({ alerts: [] }),

  selectDevice: (id) => set({ selectedDeviceId: id }),
  setScanning: (isScanning) => set({ isScanning }),

  addSafeZone: async (deviceId, zone) => {
    try {
      const deviceRef = doc(database, "devices", deviceId);
      await updateDoc(deviceRef, {
        safeZones: arrayUnion(zone)
      });
      // Local update
      set((state) => ({
        devices: state.devices.map(d => d.id === deviceId ? {
          ...d,
          safeZones: [...(d.safeZones || []), zone]
        } : d)
      }));
      
      // Sync with OS geofencing
      await syncGeofencesWithStore();
    } catch (e) {
      console.error("Failed to add safe zone:", e);
    }
  },

  removeSafeZone: async (deviceId, zoneId) => {
    try {
      const device = get().devices.find(d => d.id === deviceId);
      if (!device || !device.safeZones) return;
      
      const zoneToRemove = device.safeZones.find(z => z.id === zoneId);
      if (!zoneToRemove) return;

      const deviceRef = doc(database, "devices", deviceId);
      await updateDoc(deviceRef, {
        safeZones: arrayRemove(zoneToRemove)
      });
      // Local update
      set((state) => ({
        devices: state.devices.map(d => d.id === deviceId ? {
          ...d,
          safeZones: d.safeZones?.filter(z => z.id !== zoneId)
        } : d)
      }));
      
      // Sync with OS geofencing
      await syncGeofencesWithStore();
    } catch (e) {
      console.error("Failed to remove safe zone:", e);
    }
  },

  toggleLostMode: async (deviceId, isLost) => {
    try {
      const deviceRef = doc(database, "devices", deviceId);
      const status = isLost ? "lost" : "nearby"; // In reality would check BLE status
      await updateDoc(deviceRef, { status });
      
      // Local update
      set((state) => ({
        devices: state.devices.map(d => d.id === deviceId ? { ...d, status } : d)
      }));
    } catch (e) {
      console.error("Failed to toggle lost mode:", e);
    }
  },

  syncWithFirebase: (userId) => {
    set({ isLoading: true });
    const q = query(collection(database, "devices"), where("ownerId", "==", userId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firebaseDevices: NovaTagDevice[] = [];
      snapshot.forEach((doc) => {
        firebaseDevices.push({ id: doc.id, ...doc.data() } as NovaTagDevice);
      });
      
      // Merge firebase devices with existing demo devices or replace
      set({ devices: firebaseDevices.length > 0 ? firebaseDevices : get().devices, isLoading: false });
    }, (error) => {
      console.error("Firebase Sync Error:", error);
      set({ isLoading: false });
    });

    return unsubscribe;
  }
}));
