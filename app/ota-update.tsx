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
  FadeInDown
} from "react-native-reanimated";
import { otaService } from "../services/otaService";

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
    
    // Check for updates via service
    const checkUpdate = async () => {
      setStatus("checking");
      const newVersion = await otaService.checkForUpdates(deviceId!);
      if (newVersion) {
        setStatus("ready");
      } else {
        showToast("Device is already up to date", "info");
        router.back();
      }
    };
    
    checkUpdate();
  }, []);

  const startUpdate = () => {
    setStatus("updating");
    otaService.startUpdate(deviceId!, "http://dummy/firmware.bin", (p) => {
      progress.value = p;
      setProgressDisplay(p);
      if (p >= 100) {
        setStatus("verifying");
        setTimeout(() => {
          setStatus("success");
          showToast(`${device?.name} is now up to date!`, "success");
        }, 1500);
      }
    });
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%` as any
  }));

  return (
    <View className="flex-1 bg-[#f7f9fc]"> {/* Material 3 Surface Tone */}
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1 px-6 justify-between py-6">
        
        {/* Header */}
        <View className="items-center mt-10">
          <View className="w-24 h-24 rounded-[32px] bg-[#e8f0fe] items-center justify-center shadow-sm">
            <MaterialCommunityIcons name="update" size={48} color="#0066cc" />
          </View>
          <Text className="text-[#1c1b1f] text-3xl font-bold mt-6">Firmware Update</Text>
          <Text className="text-[#49454f] text-center mt-2 px-6 text-sm">
            Optimizing {device?.name || "your device"} for better range and battery life.
          </Text>
        </View>

        {/* Content Area */}
        <View className="flex-1 justify-center">
          {status === "checking" && (
            <View className="items-center">
              <ActivityIndicator size="large" color="#0066cc" />
              <Text className="text-[#49454f] mt-4 font-medium">Checking for updates...</Text>
            </View>
          )}

          {status === "ready" && (
            <View className="w-full bg-white p-6 rounded-[28px] shadow-sm">
              <View className="flex-row justify-between mb-4">
                <Text className="text-[#49454f] font-bold uppercase text-xs">Current Version</Text>
                <Text className="text-[#1c1b1f] font-bold">{device?.firmware || "1.0.0"}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-[#49454f] font-bold uppercase text-xs">New Version</Text>
                <Text className="text-[#0066cc] font-bold">2.1.0 (LTS)</Text>
              </View>
            </View>
          )}

          {(status === "updating" || status === "verifying") && (
            <View className="w-full bg-white p-6 rounded-[28px] shadow-sm">
              <View className="h-2 bg-[#f3f4f9] rounded-full overflow-hidden mb-4">
                <Animated.View 
                  className="h-full bg-[#0066cc]"
                  style={progressStyle}
                />
              </View>
              <Text className="text-[#1c1b1f] text-center font-bold text-lg">
                {status === "updating" ? `Uploading... ${progressDisplay}%` : "Verifying Installation..."}
              </Text>
              <Text className="text-[#ba1a1a] text-center mt-2 text-xs font-medium">
                Do not close the app or move the tag.
              </Text>
            </View>
          )}

          {status === "success" && (
            <Animated.View entering={FadeInDown} className="items-center w-full bg-white p-6 rounded-[28px] shadow-sm">
              <View className="w-16 h-16 rounded-full bg-[#e8f0fe] items-center justify-center mb-4">
                <MaterialCommunityIcons name="check-decagram" size={32} color="#0066cc" />
              </View>
              <Text className="text-[#1c1b1f] text-xl font-bold">Update Complete</Text>
              <Text className="text-[#49454f] text-center mt-1 text-sm">
                {device?.name} is running the latest firmware.
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Footer Actions */}
        <View className="w-full mb-6">
          {status === "ready" && (
            <>
              <Pressable 
                onPress={startUpdate}
                className="bg-[#0066cc] w-full py-4 rounded-full items-center shadow-sm"
              >
                <Text className="text-white font-bold text-base">Update Now</Text>
              </Pressable>
              <Pressable onPress={() => router.back()} className="mt-4 items-center">
                <Text className="text-[#49454f] font-semibold text-sm">Remind Me Later</Text>
              </Pressable>
            </>
          )}

          {status === "success" && (
            <Pressable 
              onPress={() => router.back()}
              className="bg-[#0066cc] w-full py-4 rounded-full items-center shadow-sm"
            >
              <Text className="text-white font-bold text-base">Done</Text>
            </Pressable>
          )}

          {(status === "updating" || status === "verifying") && (
            <View className="py-4 items-center">
              <Text className="text-[#49454f] text-sm">Update in progress...</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
