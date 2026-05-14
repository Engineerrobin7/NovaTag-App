import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@store/useAuthStore";
import { auth } from "@services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, but we might need to fetch the full profile
        // For now, if we already have the user in store, we're good
        if (!user) {
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
