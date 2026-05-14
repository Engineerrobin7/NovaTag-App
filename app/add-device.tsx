import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay,
  Easing,
  interpolate,
  Extrapolate
} from "react-native-reanimated";
import { Canvas, Circle, BlurMask } from "@shopify/react-native-skia";

const { width } = Dimensions.get("window");

const Pulse = ({ delay = 0 }: { delay?: number }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withDelay(delay, withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.out(Easing.quad) }),
      -1,
      false
    ));
    opacity.value = withDelay(delay, withRepeat(
      withTiming(0, { duration: 2500, easing: Easing.out(Easing.quad) }),
      -1,
      false
    ));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scale.value, [0, 1], [0.5, 3]) }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={animatedStyle}
      className="absolute w-32 h-32 rounded-full border border-primary/30"
    />
  );
};

export default function AddDeviceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Back Button */}
      <Pressable 
        onPress={() => router.back()}
        className="px-8 pt-4"
      >
        <MaterialCommunityIcons name="chevron-left" size={32} color="black" />
      </Pressable>

      <View className="flex-1 px-8 pt-8 pb-12 justify-between">
        <View>
          <Text className="text-black text-4xl font-bold tracking-tight">
            Add NovaTag
          </Text>
          <Text className="text-gray-500 text-lg mt-4 leading-7">
            Hold your NovaTag near this device. Make sure it's awake and ready to pair.
          </Text>
        </View>

        {/* Animated Radar Pulse */}
        <View className="items-center justify-center py-20">
          <View className="relative items-center justify-center">
            <Pulse />
            <Pulse delay={800} />
            <Pulse delay={1600} />
            
            <View className="w-32 h-32 rounded-full bg-primary items-center justify-center shadow-xl shadow-primary/40 z-10">
              <MaterialCommunityIcons name="plus" size={48} color="white" />
            </View>
          </View>
          <Text className="text-primary font-semibold mt-16 tracking-widest uppercase text-xs">
            Scanning for nearby tags...
          </Text>
        </View>

        <View>
          <View className="bg-gray-50 rounded-3xl p-6 mb-8 flex-row items-center">
            <View className="w-12 h-12 rounded-2xl bg-white items-center justify-center shadow-sm">
              <MaterialCommunityIcons name="bluetooth" size={24} color="#0066cc" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-black font-semibold">Proximity Discovery</Text>
              <Text className="text-gray-400 text-sm">Automatic BLE detection enabled</Text>
            </View>
          </View>

          <Pressable 
            onPress={() => router.push("/pairing")}
            className="bg-black py-5 rounded-2xl items-center active:bg-black/90"
          >
            <Text className="text-white font-semibold text-lg">Continue</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
