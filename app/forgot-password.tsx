import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

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
              Recovery
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(400)} className="text-gray-400 text-lg mt-4 leading-7">
              Enter your email and we'll send you a secure link to reset your password.
            </Animated.Text>

            <Animated.View entering={FadeInDown.delay(600)} className="mt-12">
              <View className="mb-6">
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1 mb-2">Email Address</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@novatag.com"
                  className="bg-gray-50 p-5 rounded-2xl text-lg text-black border border-gray-100"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Pressable 
                onPress={() => router.push("/otp")}
                className="bg-primary py-5 rounded-2xl items-center active:bg-primary/90 mt-4 shadow-lg shadow-primary/20"
              >
                <Text className="text-white font-bold text-lg">Send Recovery Link</Text>
              </Pressable>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
