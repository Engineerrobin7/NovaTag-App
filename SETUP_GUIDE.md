# NovaTag Mobile App - Complete Setup & Deployment Guide

## Overview

NovaTag is a production-ready premium smart tracking ecosystem mobile app built with React Native, Expo, TypeScript, and Firebase. The app provides users with a seamless experience for tracking, managing, and sharing smart tracking devices across iOS and Android platforms.

---

## Prerequisites

- **Node.js** (v16+) and npm
- **Expo CLI**: `npm install -g expo-cli`
- **Firebase account** with a new project
- **Xcode** (for iOS) or **Android Studio** (for Android)
- **CocoaPods** (for iOS dependencies)

---

## Installation & Setup

### 1. Install Dependencies

```bash
cd "path/to/Novatag app"
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use an existing one
3. Enable Authentication (Email/Password, Google Sign-In)
4. Create a Firestore database
5. Set up Storage bucket
6. Enable Cloud Messaging
7. Enable Analytics

Copy your Firebase config values and update:

```typescript
// constants/firebaseConfig.ts
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID",
  measurementId: "YOUR_FIREBASE_MEASUREMENT_ID"
};
```

### 3. Configure Expo Project

Update `app.json` with your bundle identifiers:

```json
{
  "ios": {
    "bundleIdentifier": "com.yourcompany.novatag"
  },
  "android": {
    "package": "com.yourcompany.novatag"
  }
}
```

---

## Development

### Start Expo Development Server

```bash
npm start
```

You'll see a QR code. Scan it with:
- **Expo Go app** (iOS/Android) for quick testing
- **Physical device** or simulator

### Run on iOS Simulator

```bash
npm run ios
```

### Run on Android Emulator

```bash
npm run android
```

### Run on Web (for testing UI)

```bash
npm run web
```

---

## Project Structure

```
novatag/
├── app/                      # Expo Router screens & layouts
│   ├── _layout.tsx           # Root layout with ThemeProvider
│   ├── splash.tsx            # Splash screen
│   ├── welcome.tsx           # Welcome screen
│   ├── onboarding/           # Onboarding flows
│   ├── sign-in.tsx           # Authentication screens
│   ├── home.tsx              # Main dashboard
│   ├── map.tsx               # Map tracking view
│   ├── nearby.tsx            # Nearby search radar
│   ├── precision.tsx         # Precision finding
│   ├── tag.tsx               # Device detail screen
│   ├── alerts.tsx            # Smart alerts
│   ├── family.tsx            # Family sharing
│   ├── profile.tsx           # User profile
│   ├── settings.tsx          # App settings
│   └── subscription.tsx       # Premium plans
│
├── components/               # Reusable UI components
│   ├── ScreenShell.tsx       # Screen wrapper with safe area
│   ├── PrimaryButton.tsx     # Primary & ghost buttons
│   ├── CardPanel.tsx         # Glassmorphism cards
│   ├── SectionHeader.tsx     # Section titles
│   └── AnimatedBadge.tsx     # Status badges
│
├── services/                 # Backend & device services
│   ├── firebase.ts           # Firebase initialization
│   ├── bleManager.ts         # BLE scanning & pairing
│   ├── otaService.ts         # Firmware OTA updates
│   ├── notifications.ts      # Push notifications
│   └── analytics.ts          # Firebase Analytics
│
├── store/                    # Zustand state management
│   ├── useAuthStore.ts       # User authentication state
│   ├── useDeviceStore.ts     # Device & alerts state
│   └── useUIStore.ts         # App UI state
│
├── hooks/                    # Custom React hooks
│   ├── usePermissions.ts     # System permissions
│   └── useHaptics.ts         # Haptic feedback
│
├── theme/                    # Design system
│   ├── colors.ts             # Color palette
│   ├── typography.ts         # Typography system
│   └── index.ts              # Theme provider
│
├── constants/                # App constants
│   ├── routes.ts             # Navigation routes
│   ├── firebaseConfig.ts     # Firebase configuration
│   └── permissions.ts        # Permission keys
│
├── utils/                    # Helper functions
│   ├── motion.ts             # Animation easing curves
│   └── format.ts             # Data formatting
│
├── types/                    # TypeScript types
│   ├── device.ts             # Device & NovaTag types
│   ├── user.ts               # User profile types
│   └── alert.ts              # Alert types
│
├── assets/                   # Images, fonts, icons (placeholder)
│   ├── icon.png
│   └── splash.png
│
├── app.json                  # Expo configuration
├── babel.config.js           # Babel configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies
└── README.md                 # Documentation
```

---

## Key Features Implemented

### Authentication
- Email/password login & signup
- Forgot password flow with OTP
- Account setup with profile personalization

### Device Management
- BLE scanning and pairing flow
- Real-time device status & battery monitoring
- OTA firmware update service
- Lost mode activation

### Tracking
- Map view with device markers
- Nearby radar search with BLE signal strength
- Precision finding with directional guidance
- Safe zones and geofencing support

### Smart Alerts
- Battery low alerts
- Device left safe zone alerts
- Connection loss alerts
- Motion detection alerts

### Family & Sharing
- Invite family members
- Shared device access
- Collaborative tracking

### User Experience
- Premium glassmorphism design
- Smooth animations with Reanimated
- Haptic feedback on actions
- Dark mode support (in settings)
- Premium subscription management

---

## Technology Stack

| Layer | Tech |
|-------|------|
| Frontend | React Native, Expo, TypeScript |
| Navigation | Expo Router |
| Styling | NativeWind, Reanimated v3 |
| State | Zustand |
| Backend | Firebase (Auth, Firestore, Storage, Messaging, Analytics) |
| Device Communication | react-native-ble-plx |
| Maps | react-native-maps |
| Haptics | expo-haptics |
| Notifications | expo-notifications |
| Location | expo-location |

---

## Building for Production

### iOS

```bash
eas build --platform ios
```

Or locally:
```bash
npm run ios -- --release
```

### Android

```bash
eas build --platform android
```

Or locally:
```bash
npm run android -- --release
```

---

## Firebase Security Rules

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      
      match /devices/{deviceId} {
        allow read, write: if request.auth.uid == uid;
      }
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{uid}/avatar/{allPaths=**} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

---

## Environment Variables

Create a `.env` file (do not commit to version control):

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
```

Load in your app:
```typescript
import { config } from 'dotenv';
config();
```

---

## Testing

### Unit Tests (Optional Setup)

```bash
npm install --save-dev jest @testing-library/react-native
```

### E2E Tests (Optional Setup)

```bash
npm install --save-dev detox detox-cli
```

---

## Performance Optimization

### Image Optimization
- Use WebP format for images
- Compress with ImageOptim or TinyPNG
- Lazy load images with `react-native-fast-image`

### Code Splitting
- Expo Router automatically splits code per route
- Lazy load heavy components

### Analytics
- Monitor performance with Firebase Analytics
- Use React DevTools Profiler

---

## Troubleshooting

### Build Issues

**"Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**"Babel configuration error"**
```bash
rm -rf .expo
npm start -- --clear
```

### Firebase Issues

**"Permission denied"** - Update Firestore/Storage rules
**"Initialization error"** - Verify Firebase config in `firebaseConfig.ts`

### BLE Issues

**"Bluetooth unavailable"** - Enable Bluetooth on device
**"Cannot scan"** - Grant location permission on Android 12+

---

## Deployment Checklist

- [ ] Firebase project configured with all services
- [ ] App.json updated with correct bundle IDs
- [ ] Firebase config values set in constants
- [ ] All screens tested on iOS & Android
- [ ] Onboarding flow completed
- [ ] Login/signup working with Firebase
- [ ] Device pairing working
- [ ] Notifications tested
- [ ] Privacy policy added
- [ ] Terms of service added
- [ ] App icon & splash updated
- [ ] Version bumped in app.json
- [ ] Built and tested on physical devices

---

## Support & Documentation

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [react-native-ble-plx](https://github.com/dotintent/react-native-ble-plx)
- [react-native-maps](https://github.com/react-native-maps/react-native-maps)

---

## License

MIT - See LICENSE file for details

---

## Contact

For support or questions, contact: support@novatag.com
