# NovaTag App Architecture & Design Decisions

## Design Philosophy

NovaTag follows an **Apple-inspired premium design philosophy** that emphasizes:

- **Minimalism**: Clean, spacious layouts with intentional use of whitespace
- **Glassmorphism**: Soft UI with blur effects and subtle transparency
- **Typography-First**: Large, bold headlines with tight leading
- **Emotional UX**: Calm, confident interactions with purposeful motion
- **Accessibility**: WCAG AA compliant with proper contrast ratios

---

## Component Architecture

### Atomic Design Approach

```
atoms/
  └── AnimatedBadge, PrimaryButton (small, reusable units)
  
molecules/
  └── CardPanel, SectionHeader (combinations of atoms)
  
organisms/
  └── DeviceCard, AlertList (complex, self-contained components)
  
screens/
  └── HomeScreen, MapScreen (full page experiences)
```

### Props Pattern

All components use TypeScript interfaces for type safety:

```typescript
type ComponentProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "ghost";
  style?: ViewStyle;
};
```

---

## State Management Strategy

### Zustand Stores

Using Zustand for lightweight, reactive state:

- **useAuthStore** - User authentication and profile
- **useDeviceStore** - Connected devices and alerts
- **useUIStore** - App UI state (dark mode, menu open)

**Why Zustand?**
- Minimal boilerplate
- Excellent TypeScript support
- No provider hell
- Optimized re-renders (subscriptions)

### Firebase Real-time Sync

Device state synchronized with Firestore:

```typescript
useEffect(() => {
  const unsubscribe = deviceService.subscribeToDevices(
    userId,
    (devices) => setDevices(devices)
  );
  return unsubscribe;
}, [userId]);
```

---

## Animation System

### Motion Curves

Using React Native Reanimated v3 with Apple-inspired easing:

```typescript
const motion = {
  smooth: {
    duration: 480,
    easing: Easing.bezier(0.22, 1, 0.36, 1) // iOS-like
  },
  gentle: {
    duration: 360,
    easing: Easing.bezier(0.36, 0, 0.66, 1) // Spring-like
  }
};
```

### Animation Patterns

1. **Entrance**: Fade + Scale Up (splash, onboarding)
2. **Navigation**: Slide right (back) / Slide left (forward)
3. **Interactive**: Spring physics (button press, card tap)
4. **Feedback**: Haptic + Scale feedback (success, error)

---

## Navigation Architecture

### Expo Router

Using file-based routing for simplicity:

```
app/
├── _layout.tsx (root layout)
├── home.tsx (/ route)
├── map.tsx (/map route)
└── onboarding/ (grouped routes)
    ├── track-everything.tsx
    └── peace-of-mind.tsx
```

### Dynamic Routes

For device detail screens:

```typescript
router.push(`/tag?id=${deviceId}`);
```

---

## BLE & Device Communication

### Scanning Strategy

1. **Automatic background scan** when app opens
2. **Manual scan** from "Add Device" screen
3. **Continuous monitoring** of paired devices

### Device Pairing Flow

```
Scan → Discover → Select → Connect → Authenticate → Name → Setup Complete
```

### Data Exchange Format

```json
{
  "type": "status",
  "device_id": "F1A3",
  "battery": 87,
  "signal": -52,
  "status": "connected"
}
```

---

## Firebase Integration Points

### Authentication Flow

```
Sign Up → Email Verification → Profile Setup → Home
```

### Real-time Sync

```
Device Connected (Local BLE)
  ↓
Update Zustand Store
  ↓
Upload to Firestore
  ↓
Cloud Function triggered
  ↓
Send Push Notification to Family
```

### Offline Support

- Firestore offline persistence enabled
- Local caching of device data
- Sync on reconnection

---

## Performance Optimizations

### Code Splitting

Expo Router automatically code-splits per route:
- Home screen loads first
- Map/tracking screens lazy-loaded
- Settings/profiles load on demand

### Image Optimization

- Use JPEG for hero images
- Use PNG for icons with transparency
- Cache with `react-native-fast-image` (optional)
- Placeholder blur during load

### Rendering Optimization

- Memoize expensive components with `React.memo`
- Use `useCallback` for event handlers
- Batch Firestore queries
- Virtual scrolling for long lists

---

## Security Implementation

### Authentication

- Firebase Auth handles all authentication
- No passwords stored locally
- Sessions stored securely in device keychain

### Data Encryption

- Firestore rules enforce user isolation
- Sensitive data (location) only readable by owner
- Storage bucket rules restrict access

### Network Security

- All Firebase communication is SSL/TLS encrypted
- BLE communication is unencrypted (ESP32 limitation)
- Consider OTA firmware signing for ESP32

---

## Testing Strategy

### Unit Tests (Future)

```typescript
test("formatDistance converts meters correctly", () => {
  expect(formatDistance(1500)).toBe("1.5 km");
});
```

### Integration Tests (Future)

```typescript
test("Sign in flow works", async () => {
  // Mock Firebase
  // Test email input → password input → sign in button → home redirect
});
```

### Manual Testing Checklist

- [ ] All screens render without errors
- [ ] Navigation works bidirectionally
- [ ] Firebase sync working
- [ ] BLE scanning functional
- [ ] Offline mode graceful
- [ ] Dark mode toggle works
- [ ] Haptics firing correctly

---

## Accessibility

### WCAG 2.1 AA Compliance

- Color contrast ≥ 4.5:1 for text
- Touch targets ≥ 44x44 pt
- Semantic HTML/RN components
- Keyboard navigation support
- Screen reader labels

### Platform-Specific

**iOS:**
- Use `accessibilityLabel`, `accessibilityHint`
- Support VoiceOver

**Android:**
- Use `accessible={true}` on interactive elements
- Support TalkBack

---

## Deployment Pipeline

### Development
- Local Expo server
- Firebase emulator (optional)
- Physical device testing

### Staging
- EAS Build for internal testing
- TestFlight (iOS) / Google Play Beta (Android)
- Firebase staging project

### Production
- EAS Build with production config
- App Store / Google Play submission
- Firebase production project with monitoring
- Rollout gradually (25% → 50% → 100%)

---

## Monitoring & Analytics

### Firebase Analytics Events

```typescript
analyticsService.logEvent("device_paired", { 
  device_type: "keys",
  pairing_duration: 15
});
```

### Crash Reporting

Enable Firebase Crashlytics (automatic with Firebase SDK)

### Performance Monitoring

Monitor:
- App startup time
- Screen load time
- Firestore query latency
- BLE scan duration

---

## Future Enhancements

1. **Wearable Support** - Apple Watch & Wear OS integration
2. **AR Finding** - Augmented reality device locating
3. **Predictive Location** - ML-based location prediction
4. **Voice Commands** - Siri & Google Assistant integration
5. **Advanced Analytics** - Device movement patterns
6. **Social Sharing** - Share device locations with friends
7. **Multi-language** - i18n support
8. **Dark Mode** - Full dark theme implementation

---

## Troubleshooting & Debugging

### Common Issues

**White screen on startup**
- Check `_layout.tsx` for errors
- Verify Firebase config loaded
- Clear Expo cache: `expo start --clear`

**BLE not scanning**
- Verify permissions granted
- Check device Bluetooth enabled
- Ensure no other BLE app scanning

**Firestore not syncing**
- Verify user authenticated
- Check Firestore rules
- Monitor network requests in DevTools

### Debug Tools

- React DevTools Profiler (npm start → select debugger)
- Flipper (official React Native debugger)
- Firebase Emulator Suite (local testing)
- Xcode/Android Studio built-in debuggers

---

## Code Style & Conventions

### Naming

- Components: PascalCase (`HomeScreen.tsx`)
- Functions: camelCase (`formatDistance()`)
- Constants: UPPER_SNAKE_CASE (`FIREBASE_CONFIG`)
- Files: kebab-case (`auth-service.ts`)

### Imports

Group imports in this order:
1. React & React Native
2. Expo
3. Third-party libraries
4. Local components
5. Local services/utils
6. Local types

```typescript
import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { CardPanel } from "@components/CardPanel";
import { bleService } from "@services/bleManager";
import { colors } from "@theme/colors";
```

### Comments

Use TSDoc for functions:

```typescript
/**
 * Formats distance in meters to human-readable string.
 * @param meters - Distance in meters
 * @returns Formatted distance string (e.g., "1.5 km")
 */
export function formatDistance(meters: number): string {
  // implementation
}
```

---

## Version & Changelog

**Current Version:** 1.0.0

**Changelog:**
- v1.0.0 - Initial production release
  - All 30 screens implemented
  - BLE pairing functional
  - Firebase authentication
  - Device tracking with map & radar
  - Smart alerts system
  - Family sharing
  - Premium subscription flow
