import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { auth, database } from "@services/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuthStore } from "@store/useAuthStore";
import { useToastStore } from "@store/useToastStore";

export default function SignUpScreen() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToastStore((state) => state.show);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      showToast("Please fill in all fields", "warning");
      return;
    }

    if (password.length < 6) {
      showToast("Password should be at least 6 characters", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      const userData = {
        uid: user.uid,
        displayName: name,
        email: email,
        premium: false,
        familyIds: [],
        createdAt: new Date().toISOString(),
      };

      // Create profile in Firestore
      await setDoc(doc(database, "users", user.uid), userData);

      setUser(userData);
      showToast("Account created successfully!", "success");
      router.replace("/account-setup");
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Sign Up Failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const SocialButton = ({ icon, label, onPress }: any) => (
    <Pressable 
      onPress={onPress}
      className="flex-row items-center justify-center bg-white border border-gray-100 py-4 rounded-2xl mb-4 active:bg-gray-50"
    >
      <MaterialCommunityIcons name={icon} size={24} color="black" />
      <Text className="ml-3 font-semibold text-lg">{label}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-8 pt-12">
          <Text className="text-black text-4xl font-bold tracking-tight">
            Join NovaTag
          </Text>
          <Text className="text-gray-500 text-lg mt-4 leading-7">
            Create an account to start tracking what matters most to you.
          </Text>

          <View className="mt-12">
            <View className="mb-6">
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1 mb-2">Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Alex Johnson"
                className="bg-gray-50 p-5 rounded-2xl text-lg text-black border border-gray-100"
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1 mb-2">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@novatag.com"
                className="bg-gray-50 p-5 rounded-2xl text-lg text-black border border-gray-100"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1 mb-2">Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                className="bg-gray-50 p-5 rounded-2xl text-lg text-black border border-gray-100"
                secureTextEntry
              />
            </View>

            <Pressable 
              onPress={handleSignUp}
              disabled={isLoading}
              className="bg-primary py-5 rounded-2xl items-center active:bg-primary/90 mt-4 shadow-lg shadow-primary/20"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-lg">Create Account</Text>
              )}
            </Pressable>
          </View>

          <View className="flex-row items-center my-10">
            <View className="flex-1 h-[1px] bg-gray-100" />
            <Text className="mx-4 text-gray-400 font-medium">or join with</Text>
            <View className="flex-1 h-[1px] bg-gray-100" />
          </View>

          <View>
            <SocialButton icon="apple" label="Join with Apple" />
            <SocialButton icon="google" label="Join with Google" />
          </View>

          <View className="mt-8 mb-12 flex-row justify-center">
            <Text className="text-gray-400 text-base">Already have an account? </Text>
            <Pressable onPress={() => router.push("/sign-in")}>
              <Text className="text-primary text-base font-semibold">Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
