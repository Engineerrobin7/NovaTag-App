import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TextInput, Pressable, Image, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function AccountSetupScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop");

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} className="px-8 pt-12">
            <Animated.Text entering={FadeInDown.delay(200)} className="text-black text-4xl font-bold tracking-tight">
              Finish your{"\n"}profile.
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(400)} className="text-gray-400 text-lg mt-4 leading-7">
              Personalize your NovaTag experience with a profile photo and display name.
            </Animated.Text>

            <View className="items-center justify-center py-12">
              <Animated.View entering={FadeInDown.delay(600)} className="relative">
                <View className="w-40 h-40 rounded-full border-4 border-primary/10 p-1">
                  <Image 
                    source={{ uri: avatar }}
                    className="w-full h-full rounded-full"
                  />
                </View>
                <Pressable className="absolute bottom-0 right-0 w-12 h-12 bg-primary rounded-full border-4 border-white items-center justify-center shadow-lg">
                  <MaterialCommunityIcons name="camera-outline" size={24} color="white" />
                </Pressable>
              </Animated.View>
            </View>

            <Animated.View entering={FadeInDown.delay(800)} className="space-y-6">
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1 mb-2">Display Name</Text>
                <TextInput
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Alex Johnson"
                  className="bg-gray-50 p-5 rounded-2xl text-lg text-black border border-gray-100"
                />
              </View>

              <View className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex-row items-center">
                <MaterialCommunityIcons name="information-outline" size={24} color="#0066cc" />
                <Text className="text-blue-700 ml-4 flex-1 text-sm leading-5">
                  Your name and photo will be visible to family members you share tags with.
                </Text>
              </View>
            </Animated.View>

            <View className="flex-1" />

            <Animated.View entering={FadeInDown.delay(1000)} className="pb-10 pt-6">
              <Pressable 
                onPress={() => router.replace("/add-device")}
                className="bg-black py-5 rounded-2xl items-center active:bg-black/90 shadow-xl shadow-black/20"
              >
                <Text className="text-white font-bold text-lg">Complete Setup</Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
