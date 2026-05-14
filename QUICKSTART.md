# NovaTag Quick Start Guide

## 30-Second Setup

```bash
# 1. Install dependencies
npm install

# 2. Add Firebase config to constants/firebaseConfig.ts

# 3. Start Expo
npm start

# 4. Scan QR code with Expo Go app or press 'i' for iOS simulator
```

---

## What's Included

✅ **30 production-ready screens**
- Splash, onboarding, auth (sign in/up/forgot password/reset)
- Main dashboard with device cards
- Map view with markers
- Nearby radar search with signal strength
- Precision finding with directional guidance
- Device details, lost mode, battery monitoring
- Smart alerts system
- Family sharing & profile
- Support center with FAQs
- Premium subscription plans
- App settings with dark mode
- Emergency SOS

✅ **Backend integration**
- Firebase Auth (email/password, Google Sign-In ready)
- Firestore real-time device sync
- Firebase Storage for avatars
- Cloud Messaging for notifications
- Analytics tracking

✅ **Device communication**
- BLE scanning & pairing
- RSSI signal strength monitoring
- OTA firmware update framework
- Device telemetry collection

✅ **Premium UX**
- Glassmorphism design (CardPanel, BlurView)
- Apple-inspired animations (Reanimated v3)
- Haptic feedback (button press, success)
- Location tracking with react-native-maps
- Clean typography system (SF Pro inspired)

---

## Key Files to Understand

| File | Purpose |
|------|---------|
| `app/_layout.tsx` | Root layout with ThemeProvider |
| `app/home.tsx` | Main dashboard - **START HERE** |
| `theme/colors.ts` | Design system color palette |
| `store/useDeviceStore.ts` | Global device state |
| `services/firebase.ts` | Firebase initialization |
| `services/bleManager.ts` | Bluetooth communication |
| `components/CardPanel.tsx` | Reusable glass-effect card |

---

## Common Tasks

### Add a New Screen

1. Create file in `app/` directory:
```typescript
// app/my-screen.tsx
import { View, Text } from "react-native";
import { colors } from "@theme/colors";

export default function MyScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text>Your content here</Text>
    </View>
  );
}
```

2. Navigate to it:
```typescript
import { useRouter } from "expo-router";
const router = useRouter();
router.push("/my-screen");
```

### Add a Device

1. Call BLE scan:
```typescript
import { bleService } from "@services/bleManager";
bleService.startScan((device) => console.log(device.name));
```

2. Connect & save:
```typescript
import { useDeviceStore } from "@store/useDeviceStore";
const { setDevices } = useDeviceStore();
setDevices([...devices, newDevice]);
```

### Show an Alert

```typescript
import { analyticsService } from "@services/analytics";
analyticsService.logEvent("device_lost", { deviceId: "123" });

// Or send notification
import { notificationService } from "@services/notifications";
notificationService.scheduleLocalNotification("Lost Device", "Keys not found");
```

---

## Architecture Overview

```
User Input (Screen)
    ↓
Navigation (Expo Router)
    ↓
Component Rendering
    ↓
Event Handler (Hook/Store)
    ↓
Service Call (Firebase/BLE)
    ↓
State Update (Zustand)
    ↓
Re-render UI
```

---

## Debugging Tips

### See Redux state (Zustand)
```typescript
import { useAuthStore } from "@store/useAuthStore";
const user = useAuthStore((state) => state.user);
console.log("Current user:", user);
```

### Check Firebase connection
```typescript
import { auth } from "@services/firebase";
console.log("Authenticated user:", auth.currentUser);
```

### Test BLE scan
```bash
# In app
bleService.startScan((device) => {
  console.log("Found device:", device.name, device.rssi);
});
```

### View Firestore data
- Open Firebase Console
- Go to Firestore Database
- Browse collections to see real-time data

---

## Testing Checklist

Before pushing to production:

- [ ] App starts without errors
- [ ] All screens navigate correctly
- [ ] Sign in/up works with Firebase
- [ ] Device pairing works (or simulator)
- [ ] Notifications display when triggered
- [ ] Dark mode toggle works
- [ ] No console errors or warnings
- [ ] Performance: app opens in <3 seconds
- [ ] Offline mode graceful (no crashes)

---

## Environment Setup

### iOS
```bash
# Install pods
cd ios && pod install && cd ..

# Run on simulator
npm run ios
```

### Android
```bash
# Run on emulator
npm run android
```

### Web (for UI testing only)
```bash
npm run web
```

---

## Performance Baseline

Target metrics:
- App launch: < 3 seconds
- Screen transition: < 300ms
- Device list scroll: 60 FPS (no jank)
- Firestore query: < 1 second

Monitor with:
```bash
npm start  # See Performance Monitor in Expo CLI
```

---

## Next Steps

1. **Configure Firebase**
   - Update `constants/firebaseConfig.ts`
   - Set Firestore rules from `FIREBASE_SETUP.md`

2. **Test BLE**
   - Pair a real NovaTag device or simulator
   - Monitor signal strength in Nearby screen

3. **Customize Branding**
   - Update app icon in `assets/`
   - Update splash screen
   - Update colors in `theme/colors.ts`

4. **Deploy**
   - Follow `SETUP_GUIDE.md` for iOS App Store / Google Play

---

## Useful Commands

```bash
# Start fresh
rm -rf node_modules package-lock.json && npm install

# Clear cache
npm start -- --clear

# Type check
npm run typecheck

# Run linter
npm run lint

# Eject from Expo (last resort - loses managed features)
expo prebuild
```

---

## Support

- 📚 [Expo Docs](https://docs.expo.dev)
- 🔥 [Firebase Docs](https://firebase.google.com/docs)
- ⚛️ [React Native Docs](https://reactnative.dev)
- 💬 GitHub Issues (for this project)

---

**Happy coding! 🚀**
