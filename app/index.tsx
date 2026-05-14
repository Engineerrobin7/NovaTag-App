import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@store/useAuthStore";
import { auth } from "@services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Only set a minimal profile if one doesn't already exist in the store
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "User",
            premium: false,
            familyIds: [],
            createdAt: new Date().toISOString(),
          });
        }
        router.replace("/home");
      } else {
        // User is signed out
        router.replace("/welcome");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
      <ActivityIndicator size="large" color="#0066cc" />
    </View>
  );
}
