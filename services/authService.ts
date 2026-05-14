import { auth, database as db } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, setDoc, getDoc, updateDoc, onSnapshot, query, where } from "firebase/firestore";
import { UserProfile } from "../types/user";

export const authService = {
  async signUp(email: string, password: string, displayName: string) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    const userProfile: UserProfile = {
      uid: user.uid,
      displayName,
      email,
      premium: false,
      familyIds: [],
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, "users", user.uid), userProfile);
    return user;
  },

  async signIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  },

  async signOut() {
    return signOut(auth);
  },

  async getUserProfile(uid: string) {
    const docSnap = await getDoc(doc(db, "users", uid));
    return docSnap.data() as UserProfile | undefined;
  },

  subscribeToUserProfile(uid: string, callback: (profile: UserProfile | null) => void) {
    return onSnapshot(doc(db, "users", uid), (doc) => {
      callback(doc.data() as UserProfile | null);
    });
  }
};

export const deviceService = {
  async saveDevice(userId: string, deviceId: string, deviceData: any) {
    await setDoc(doc(db, "users", userId, "devices", deviceId), deviceData);
  },

  subscribeToDevices(userId: string, callback: (devices: any[]) => void) {
    return onSnapshot(collection(db, "users", userId, "devices"), (snapshot) => {
      const devices = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(devices);
    });
  }
};
