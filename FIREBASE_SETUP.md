# 🔐 NovaTag Firebase Setup Guide

Follow these steps to configure your production-ready Firebase backend for the NovaTag ecosystem.

## 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it `NovaTag`.
3. (Optional) Enable Google Analytics for cinematic user insights.

## 2. Register Your Apps
You need to register both **iOS** and **Android** apps to get the configuration files.

### 📱 Android
1. Click the Android icon in the project overview.
2. Android package name: `7`.
3. Download `google-services.json` and place it in the root directory.

### 🍎 iOS
1. Click **Add App** and select the iOS icon.
2. iOS bundle ID: `com.novatag.app`.
3. Download `GoogleService-Info.plist` and place it in the root directory.

### 🌐 Web (For Expo Development)
1. Click **Add App** and select the Web icon (</>).
2. Name it `NovaTag Web`.
3. Copy the `firebaseConfig` object and paste the values into your `.env` file (refer to `.env.example`).

## 3. Enable Services
Go to the Firebase sidebar and enable:

- **Authentication**: Enable `Email/Password`, `Google`, and `Apple` providers.
- **Firestore Database**: Create database in **Production Mode**. Choose a region close to your users.
- **Storage**: Click **Get Started** and use default settings.
- **Functions**: (Optional) For advanced server-side logic like sending push notifications.

## 4. Deploy Security Rules
Using the [Firebase CLI](https://firebase.google.com/docs/cli):

1. Login: `firebase login`
2. Initialize: `firebase init` (Select Firestore and Storage)
3. Deploy: `firebase deploy --only firestore:rules,storage:rules,firestore:indexes`

The rules are already defined in `firestore.rules` and `storage.rules` in this repository.

## 5. Environment Variables
Ensure your `.env` file is populated with the credentials from the Web App registration:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

---
*NovaTag is now ready to sync data across your ecosystem.*
