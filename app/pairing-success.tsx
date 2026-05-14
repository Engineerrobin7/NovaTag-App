import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  FadeIn,
  ZoomIn
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

export default function PairingSuccessScreen() {
  const router = useRouter();
  
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 px-8 justify-between pb-12">
        <View className="flex-1 items-center justify-center">
          <Animated.View 
            entering={ZoomIn.duration(600)}
            className="w-32 h-32 rounded-full bg-green-500 items-center justify-center shadow-xl shadow-green-500/30"
          >
            <MaterialCommunityIcons name="check" size={64} color="white" />
          </Animated.View>
          
          <Animated.View entering={FadeIn.delay(400)} className="items-center mt-12">
            <Text className="text-black text-3xl font-bold text-center">
              Successfully Paired
            </Text>
            <Text className="text-gray-500 text-lg mt-4 text-center leading-7">
              Your NovaTag is now linked to your account and ready to track.
            </Text>
          </Animated.View>
        </View>

        <Animated.View entering={FadeIn.delay(800)}>
          <Pressable 
            onPress={() => router.replace("/home")}
            className="bg-black py-5 rounded-2xl items-center active:bg-black/90"
          >
            <Text className="text-white font-semibold text-lg">Done</Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
