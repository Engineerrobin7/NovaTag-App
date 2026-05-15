# NovaTag — by InfyNova

> **Find what matters.**

A production-ready React Native app for managing NovaTag BLE trackers built on Nordic nRF52840.

---

## Quick Start

### Prerequisites
- Node.js 18+
- React Native CLI (`npm install -g react-native-cli`)
- Android Studio + Android SDK (API 23+)
- Java 17

### Install

```bash
cd NovaTag
npm install
```

### Android

```bash
# Start Metro
npm start

# In a new terminal
npm run android
```

### iOS (future)

```bash
cd ios && pod install && cd ..
npm run ios
```

---

## Mock Mode

The app ships with **Mock Mode ON** by default. This lets you use the full UI without real hardware.

To disable: **Settings → Mock Mode → Off**

Mock mode simulates:
- 3 NovaTag devices appearing in scan
- Connection/disconnection flow
- RSSI fluctuation
- Battery level (78%)
- Device information (InfyNova, FW-1.0.0)

---

## BLE UUID Replacement Guide

All placeholder UUIDs are in `src/constants/ble.ts`.

When NovaTag firmware is finalized, replace:

| Constant | Description | Where to get it |
|----------|-------------|-----------------|
| `NOVATAG_SERVICES.CONTROL` | Primary control service UUID | Firmware spec |
| `NOVATAG_SERVICES.NOTIFICATION` | Notification service UUID | Firmware spec |
| `NOVATAG_CHARACTERISTICS.RING_CONTROL` | Ring/buzzer characteristic | Firmware spec |
| `NOVATAG_CHARACTERISTICS.RING_STATUS` | Ring status notification | Firmware spec |
| `NOVATAG_CHARACTERISTICS.BUTTON_PRESS` | Button press notification | Firmware spec |
| `NOVATAG_COMMANDS.RING_START` | Start ring payload (base64) | Firmware spec |
| `NOVATAG_COMMANDS.RING_STOP` | Stop ring payload (base64) | Firmware spec |
| `NOVATAG_MANUFACTURER_ID` | InfyNova Bluetooth SIG ID | Register at bluetooth.com |

Also update `SCAN_SERVICE_UUIDS` to filter by service UUID instead of device name.

---

## Project Structure

```
src/
├── app/              # App entry point
├── navigation/       # React Navigation setup
├── features/
│   ├── onboarding/   # Welcome + permissions flow
│   ├── tracker/      # Home, Scan, Detail, Find, Rename, OTA
│   ├── settings/     # Settings screen
│   └── debug/        # BLE diagnostics (hidden)
├── services/
│   ├── ble/          # BLE service + mock service
│   └── storage/      # MMKV storage wrapper
├── store/            # Zustand stores
├── hooks/            # useBlePermissions, useDeviceScanner, etc.
├── components/       # Shared UI components
├── theme/            # Colors, typography, spacing
├── constants/        # BLE UUIDs, app constants
└── types/            # TypeScript types
```

---

## OTA Firmware Updates

OTA is **not implemented in V1**. The architecture is ready.

To implement:
1. `npm install react-native-nordic-dfu`
2. Source firmware `.zip` from your update server
3. Replace `OTAUpdateScreen.tsx` placeholder with actual DFU flow
4. Call `NordicDFU.startDFU({ deviceAddress, filePath })` with progress callbacks

---

## Running Tests

```bash
npm test
```

Tests cover:
- Mock BLE service (scan, connect, disconnect, ring, battery)
- Proximity RSSI logic
- Tracker store (add, remove, rename, live state)

---

## Debug Mode

Enable in **Settings → BLE Debug Mode**.

This reveals the **BLE Diagnostics** screen where you can:
- Select a connected device
- Discover services and characteristics
- Read/write characteristic values
- View a live connection log

---

## Tech Stack

| Library | Purpose |
|---------|---------|
| React Native 0.73 | Framework |
| TypeScript | Type safety |
| React Navigation 6 | Navigation |
| Zustand + Immer | State management |
| react-native-ble-plx | BLE |
| react-native-permissions | Permissions |
| react-native-mmkv | Fast local storage |
| react-native-reanimated | Animations |
| react-native-svg | Vector graphics |
| react-native-vector-icons | Icons |

---

## Brand

- **Product:** NovaTag
- **Company:** InfyNova
- **Tagline:** Find what matters.
- **Palette:** Dark-tech with teal (#00cccc) and blue (#0066ff) accents
