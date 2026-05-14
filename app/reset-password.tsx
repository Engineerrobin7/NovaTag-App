import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { updatePassword } from "firebase/auth";
import { auth } from "@services/firebase";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSavePassword = async () => {
    if (!password || password !== confirmPassword) return;
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No authenticated user found.");
      await updatePassword(currentUser, password);
      Alert.alert("Success", "Your password has been updated.");
      router.replace("/account-setup");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update password. You may need to re-login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 px-8 pt-12">
            <Pressable onPress={() => router.back()} className="mb-8">
              <MaterialCommunityIcons name="chevron-left" size={32} color="black" />
            </Pressable>

            <Animated.Text entering={FadeInDown.delay(200)} className="text-black text-4xl font-bold tracking-tight">
              Reset Password
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(400)} className="text-gray-400 text-lg mt-4 leading-7">
              Choose a strong password to keep your NovaTag account and devices protected.
            </Animated.Text>

            <Animated.View entering={FadeInDown.delay(600)} className="mt-12">
              <View className="mb-6">
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1 mb-2">New Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  className="bg-gray-50 p-5 rounded-2xl text-lg text-black border border-gray-100"
                  secureTextEntry
                />
              </View>

              <View className="mb-6">
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1 mb-2">Confirm Password</Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="••••••••"
                  className="bg-gray-50 p-5 rounded-2xl text-lg text-black border border-gray-100"
                  secureTextEntry
                />
              </View>

              <Pressable 
                onPress={handleSavePassword}
                disabled={!password || password !== confirmPassword || loading}
                className={`w-full py-5 rounded-2xl items-center mt-4 shadow-lg ${password && password === confirmPassword ? "bg-primary shadow-primary/20 active:bg-primary/90" : "bg-gray-200"}`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-lg">Save Password</Text>
                )}
              </Pressable>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
