/**
 * Firebase Configuration
 * Replace these values with your actual Firebase Project credentials
 * found in the Firebase Console (Project Settings > General > Your apps)
 */
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyD1iWSX7eju8N9oGJi-zrc-ax0YRiQNn3o",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "novatag-8a4d6.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "novatag-8a4d6",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "novatag-8a4d6.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "205217015431",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:205217015431:android:474441580c8a5979be7a22",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-MEASUREMENT_ID"
};
