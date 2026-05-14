import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDeviceStore } from "@store/useDeviceStore";
import { useToastStore } from "@store/useToastStore";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  interpolate,
  FadeInDown
} from "react-native-reanimated";
import { BlurView } from "expo-blur";

export default function OTAUpdateScreen() {
  const router = useRouter();
  const { deviceId } = useLocalSearchParams<{ deviceId: string }>();
  const device = useDeviceStore((state) => state.devices.find(d => d.id === deviceId));
  const showToast = useToastStore((state) => state.show);

  const [status, setStatus] = useState<"checking" | "ready" | "updating" | "verifying" | "success">("checking");
  const [progressDisplay, setProgressDisplay] = useState(0);
  const progress = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1, false);
    
    // Simulate check
    setTimeout(() => setStatus("ready"), 1500);
  }, []);

  const startUpdate = () => {
    setStatus("updating");
    let p = 0;
    const interval = setInterval(() => {
      p += 1;
      progress.value = p;
      setProgressDisplay(p);
      if (p >= 100) {
        clearInterval(interval);
        setStatus("verifying");
        setTimeout(() => {
          setStatus("success");
          showToast(`${device?.name} is now up to date!`, "success");
        }, 2000);
      }
    }, 50);
  };

  const animatedLoaderStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%` as any
  }));

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1 px-8 items-center justify-center">
        <View className="mb-12 items-center">
          <View className={`w-32 h-32 rounded-[40px] ${device?.color || "bg-primary"} items-center justify-center shadow-2xl`}>
            <MaterialCommunityIcons name="update" size={64} color="white" />
          </View>
          <Text className="text-black text-3xl font-bold mt-8">Firmware Update</Text>
          <Text className="text-gray-400 text-center mt-2 px-6">
            Optimizing {device?.name || "your device"} for better range and battery life.
          </Text>
        </View>

        {status === "checking" && (
          <View className="items-center">
            <ActivityIndicator size="large" color="#0066cc" />
            <Text className="text-gray-400 mt-4 font-semibold">Checking for updates...</Text>
          </View>
        )}

        {status === "ready" && (
          <View className="w-full">
            <View className="bg-gray-50 p-6 rounded-3xl mb-8">
              <View className="flex-row justify-between mb-4">
                <Text className="text-gray-500 font-bold uppercase text-[10px]">Current Version</Text>
                <Text className="text-black font-bold">{device?.firmware || "1.0.0"}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500 font-bold uppercase text-[10px]">New Version</Text>
                <Text className="text-primary font-bold">2.1.0 (LTS)</Text>
              </View>
            </View>
            <Pressable 
              onPress={startUpdate}
              className="bg-primary w-full py-5 rounded-2xl items-center shadow-lg shadow-primary/20"
            >
              <Text className="text-white font-bold text-lg">Update Now</Text>
            </Pressable>
            <Pressable onPress={() => router.back()} className="mt-4 items-center">
              <Text className="text-gray-400 font-semibold">Remind Me Later</Text>
            </Pressable>
          </View>
        )}

        {(status === "updating" || status === "verifying") && (
          <View className="w-full">
            <View className="h-4 bg-gray-100 rounded-full overflow-hidden mb-6">
              <Animated.View 
                className="h-full bg-primary"
                style={progressStyle}
              />
            </View>
            <Text className="text-black text-center font-bold text-xl">
              {status === "updating" ? `Uploading... ${progressDisplay}%` : "Verifying Installation..."}
            </Text>
            <Text className="text-red-500 text-center mt-4 text-sm font-semibold">
              Do not close the app or move the tag.
            </Text>
          </View>
        )}

        {status === "success" && (
          <Animated.View entering={FadeInDown} className="items-center w-full">
            <View className="w-20 h-20 rounded-full bg-green-50 items-center justify-center mb-6">
              <MaterialCommunityIcons name="check-decagram" size={48} color="#34c759" />
            </View>
            <Text className="text-black text-2xl font-bold">Update Complete</Text>
            <Text className="text-gray-400 text-center mt-2 mb-10">
              {device?.name} is running the latest firmware.
            </Text>
            <Pressable 
              onPress={() => router.back()}
              className="bg-black w-full py-5 rounded-2xl items-center"
            >
              <Text className="text-white font-bold text-lg">Done</Text>
            </Pressable>
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  );
}
