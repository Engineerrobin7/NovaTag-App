import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSpring,
  Easing,
  interpolate,
  Extrapolate,
  FadeIn
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useDeviceStore } from "@store/useDeviceStore";
import { useToastStore } from "@store/useToastStore";

const { width, height } = Dimensions.get("window");

export default function PrecisionFindingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const device = useDeviceStore((state) => state.devices.find(d => d.id === id));
  const showToast = useToastStore((state) => state.show);

  const [distance, setDistance] = useState(15.0);
  const [found, setFound] = useState(false);
  
  const arrowRotation = useSharedValue(0);
  const pulseScale = useSharedValue(0);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    if (!device) return;

    // Simulate distance tracking
    let currentDist = 15.0;
    const interval = setInterval(() => {
      if (currentDist > 0.1) {
        currentDist = Math.max(0, currentDist - (Math.random() * 0.5));
        setDistance(parseFloat(currentDist.toFixed(1)));
        
        // Haptic "ping" intensity increases as distance decreases
        if (currentDist < 1) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } else if (currentDist < 3) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else if (currentDist < 7) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Random jitter for the arrow to make it look "live"
        arrowRotation.value = withSpring((Math.random() * 40 - 20) * (currentDist / 5));
      } else {
        setFound(true);
        clearInterval(interval);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showToast(`${device.name} found!`, "success");
      }
    }, 800);

    // Radar pulse animation
    pulseScale.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.out(Easing.quad) }),
      -1,
      false
    );
    pulseOpacity.value = withRepeat(
      withTiming(0, { duration: 2500, easing: Easing.out(Easing.quad) }),
      -1,
      false
    );

    return () => clearInterval(interval);
  }, [id, device]);

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${arrowRotation.value}deg` }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulseScale.value, [0, 1], [0.8, 2.5]) }],
    opacity: pulseOpacity.value,
  }));

  if (!device) return null;

  return (
    <View className="flex-1 bg-[#0066cc]">
      <StatusBar style="light" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="px-8 pt-4 flex-row justify-between items-center">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
            <MaterialCommunityIcons name="close" size={24} color="white" />
          </Pressable>
          <Text className="text-white font-bold text-lg">Precision Finding</Text>
          <View className="w-10" />
        </View>

        <View className="flex-1 items-center justify-center">
          {/* Radar Background */}
          <View className="absolute inset-0 items-center justify-center">
            <Animated.View 
              style={pulseStyle}
              className="w-64 h-64 rounded-full border-2 border-white/20"
            />
            <View className="w-80 h-80 rounded-full border border-white/10" />
            <View className="w-[400px] h-[400px] rounded-full border border-white/5" />
          </View>

          {/* Directional Arrow */}
          <Animated.View style={arrowStyle} className="items-center justify-center">
            <Animated.View entering={FadeIn} className="items-center justify-center">
              <MaterialCommunityIcons 
                name={found ? "check-decagram" : "navigation"} 
                size={found ? 140 : 160} 
                color="white" 
              />
            </Animated.View>
          </Animated.View>

          {/* Distance Text */}
          <View className="mt-16 items-center">
            <Text className="text-white text-7xl font-bold tabular-nums tracking-tighter">
              {found ? "Found" : `${distance}m`}
            </Text>
            <Text className="text-white/70 text-xl mt-2 font-medium tracking-wide">
              {found ? `${device.name} is here` : distance < 2 ? "Very close" : "Directly ahead"}
            </Text>
          </View>
        </View>

        {/* Footer Actions */}
        <View className="px-10 pb-12 flex-row justify-between">
          <Pressable className="w-16 h-16 rounded-3xl bg-white/10 items-center justify-center active:bg-white/20">
            <MaterialCommunityIcons name="volume-high" size={28} color="white" />
          </Pressable>
          <Pressable className="w-16 h-16 rounded-3xl bg-white/10 items-center justify-center active:bg-white/20">
            <MaterialCommunityIcons name="flashlight" size={28} color="white" />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
