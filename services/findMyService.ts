import { BleManager } from 'react-native-ble-plx';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { database } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import nacl from 'tweetnacl';

const bleManager = new BleManager();
const BACKGROUND_FIND_MY_TASK = 'BACKGROUND_FIND_MY_TASK';

// Dummy UUID for NovaTag service. In production, this should match your hardware or beacon config.
const NOVATAG_SERVICE_UUID = '12345678-1234-5678-1234-567812345678';

// Helper to convert string to Uint8Array (since TextEncoder might not be available)
function stringToBytes(str: string): Uint8Array {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes;
}

/**
 * Starts the background scanning and location reporting system.
 * Call this after the user logs in and grants necessary permissions.
 */
export async function startBackgroundScanning() {
  const { status: locStatus } = await Location.requestBackgroundPermissionsAsync();
  if (locStatus !== 'granted') {
    console.error('Background location permission not granted');
    return;
  }

  // Register the background location task
  try {
    await Location.startLocationUpdatesAsync(BACKGROUND_FIND_MY_TASK, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 15 * 60 * 1000, // Run every 15 minutes
      distanceInterval: 100, // Or every 100 meters
      foregroundService: {
        notificationTitle: 'NovaTag Network',
        notificationBody: 'Actively helping secure the network.',
      },
    });
    console.log('Background location updates started');
  } catch (error) {
    console.error('Failed to start background location updates:', error);
  }

  // Start BLE scanning immediately
  startBleScan();
}

/**
 * Scans for nearby NovaTags and reports their location if found.
 */
function startBleScan() {
  console.log('Starting BLE scan for NovaTags...');
  
  bleManager.startDeviceScan([NOVATAG_SERVICE_UUID], null, async (error, device) => {
    if (error) {
      console.error('BLE Scan Error:', error);
      return;
    }

    if (device) {
      console.log('Found NovaTag device:', device.id);
      
      try {
        // 1. Get Helper's current location
        const location = await Location.getCurrentPositionAsync({});
        
        // 2. Prepare the payload (Location Data)
        const locationStr = JSON.stringify({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
        });
        
        // 3. Encrypt the payload
        // In Apple's system, the Tag broadcasts its public key.
        // For this implementation, we assume the Tag's public key is derived or known.
        // We'll use a mock public key for the Tag for now.
        const mockTagPublicKey = new Uint8Array(32); // 32 bytes of zeros as mock
        
        // Helper generates an ephemeral key pair for this report (Sealed Box pattern)
        const ephemeralKeyPair = nacl.box.keyPair();
        const nonce = nacl.randomBytes(24);
        
        const messageBytes = stringToBytes(locationStr);
        
        // Encrypt message using Tag's Public Key and Helper's Ephemeral Private Key
        const encrypted = nacl.box(messageBytes, nonce, mockTagPublicKey, ephemeralKeyPair.secretKey);
        
        // 4. Report to Cloud Function
        // In production, replace with your actual function URL.
        // For local emulator testing: http://localhost:5001/YOUR_PROJECT_ID/us-central1/reportLocation
        const FUNCTION_URL = 'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/reportLocation';
        
        const response = await fetch(FUNCTION_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            publicKeyHash: device.id,
            encryptedData: {
              nonce: Array.from(nonce),
              ephemeralPublicKey: Array.from(ephemeralKeyPair.publicKey),
              box: Array.from(encrypted),
            },
          }),
        });

        if (response.ok) {
          console.log(`Successfully reported location for device ${device.id} via API`);
        } else {
          console.error(`Failed to report location via API: ${response.status} ${response.statusText}`);
        }
      } catch (e) {
        console.error('Error during location reporting:', e);
      }
    }
  });
}

// Define the background task that Expo TaskManager will run
TaskManager.defineTask(BACKGROUND_FIND_MY_TASK, ({ data, error }) => {
  if (error) {
    console.error('Background task error:', error);
    return;
  }
  if (data) {
    console.log('Background task woken up by location change');
    // Ensure BLE scanning is active when woken up
    startBleScan();
  }
});
