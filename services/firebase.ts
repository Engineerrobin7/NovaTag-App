import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { Auth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";
import { firebaseConfig } from "@constants/firebaseConfig";

let app: FirebaseApp;
let auth: Auth;
let database: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

// Initialize Firebase only once
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Auth for React Native specifically with AsyncStorage persistence
auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

database = getFirestore(app);
storage = getStorage(app);

// Analytics is not supported in all environments (like Node.js or some native builds)
isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
  }
});

export { app, auth, database, storage, analytics };
