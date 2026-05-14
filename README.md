# NovaTag | Premium Tracking Ecosystem

NovaTag is a luxury smart tracking ecosystem built with **React Native**, **Expo**, **TypeScript**, and **Firebase**. Designed with a "Cupertino-first" philosophy, it delivers a cinematic, high-end consumer experience.

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the root directory and add your Firebase credentials:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Run the App**
   ```bash
   npx expo start
   ```

## 💎 Design Language

- **Motion**: Powered by `react-native-reanimated` v3 for 60fps cinematic transitions.
- **Glassmorphism**: Advanced blur effects using `expo-blur`.
- **Typography**: SF Pro Display & Text system integration.
- **Visuals**: Photography-first layouts with edge-to-edge cinematic renders.

## 🛠 Tech Stack

- **Mobile**: React Native, Expo, Expo Router
- **UI/UX**: NativeWind (Tailwind), Reanimated, Skia, Lottie
- **State**: Zustand
- **Backend**: Firebase (Auth, Firestore, Analytics, Cloud Messaging)
- **Communication**: `react-native-ble-plx` for ESP32 hardware interaction

## 📱 Screen Architecture

- **Cinematic Splash**: Animated Skia branding.
- **Immersive Onboarding**: Multi-step emotional product introduction.
- **Home Dashboard**: Live map preview, horizontal tag browser, and glass navigation.
- **Precision Finding**: Futuristic Skia-based radar and directional guidance.
- **Pairing Flow**: 3D-style device rotation and seamless BLE provisioning.
- **Family Sharing**: Collaborative tracking and shared premium benefits.
- **Emergency SOS**: Hold-to-trigger high-stakes safety system.

## 📡 Hardware Integration (ESP32)

The app is pre-configured to communicate with ESP32-WROOM-32 hardware using specific BLE characteristics defined in `services/bleManager.ts`.

- **Service UUID**: `180F` (Battery), `0000ff00-...` (Control)
- **Buzzer Characteristic**: `0000ff01-...`

## 📦 Production Checklist

- [ ] Replace assets in `assets/branding/` (icon.png, splash.png).
- [ ] Configure `app.json` with your unique `bundleIdentifier` and `package` name.
- [ ] Set up Firebase Cloud Messaging for push notifications.
- [ ] Verify BLE permissions for Android 12+ and iOS in `app.json`.

---

*Designed for the modern world. Built for peace of mind.*
