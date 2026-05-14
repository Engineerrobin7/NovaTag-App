import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function OTPVerificationScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");

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
              Verification
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(400)} className="text-gray-400 text-lg mt-4 leading-7">
              We've sent a 6-digit code to your email. Enter it below to verify your identity.
            </Animated.Text>

            <Animated.View entering={FadeInDown.delay(600)} className="mt-12 items-center">
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="000000"
                className="bg-gray-50 w-full p-6 rounded-3xl text-4xl text-black border border-gray-100 text-center tracking-[20px] font-bold"
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />

              <Pressable 
                onPress={() => router.push("/reset-password")}
                disabled={code.length < 6}
                className={`w-full py-5 rounded-2xl items-center mt-10 shadow-lg ${code.length === 6 ? "bg-black shadow-black/20 active:bg-black/90" : "bg-gray-200"}`}
              >
                <Text className="text-white font-bold text-lg">Verify Code</Text>
              </Pressable>

              <Pressable className="mt-8">
                <Text className="text-primary font-semibold">Resend Code</Text>
              </Pressable>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
