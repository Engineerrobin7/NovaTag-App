import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, Pressable, Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardPanel } from "@components/CardPanel";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing,
  FadeInDown,
  withSequence,
  withDelay
} from "react-native-reanimated";
import { useDeviceStore } from "@store/useDeviceStore";
import { colors } from "@theme/colors";

const { width } = Dimensions.get("window");

const RadarRing = ({ delay = 0 }: { delay?: number }) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withDelay(delay, withRepeat(
      withTiming(3, { duration: 4000, easing: Easing.out(Easing.quad) }),
      -1,
      false
    ));
    opacity.value = withDelay(delay, withRepeat(
      withTiming(0, { duration: 4000, easing: Easing.out(Easing.quad) }),
      -1,
      false
    ));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={animatedStyle}
      className="absolute w-40 h-40 rounded-full border border-primary/30"
    />
  );
};

export default function NearbyScreen() {
  const router = useRouter();
  const devices = useDeviceStore((state) => state.devices);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="px-8 pt-4 flex-row justify-between items-center">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
            <MaterialCommunityIcons name="chevron-left" size={28} color="black" />
          </Pressable>
          <Text className="text-black font-bold text-lg">Nearby Search</Text>
          <View className="w-10" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="px-8 mt-8">
            <Text className="text-black text-4xl font-bold tracking-tight">
              {isScanning ? "Scanning..." : "Nearby"}
            </Text>
            <Text className="text-gray-400 text-lg mt-2 leading-7">
              {isScanning 
                ? "Locating your NovaTags using Bluetooth signal strength." 
                : `${devices.filter(d => d.status === "nearby").length} devices found within range.`}
            </Text>
          </View>

          {/* Radar Visualization */}
          <View className="items-center justify-center py-20">
            <View className="relative items-center justify-center">
              <RadarRing />
              <RadarRing delay={1000} />
              <RadarRing delay={2000} />
              
              <Animated.View 
                className="w-24 h-24 rounded-full bg-primary items-center justify-center shadow-2xl shadow-primary/40 z-10"
              >
                <MaterialCommunityIcons name="broadcast" size={40} color="white" />
              </Animated.View>
            </View>
          </View>

          {/* Results */}
          <View className="px-6">
            <View className="flex-row justify-between items-end mb-4 px-2">
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">Active Tags</Text>
              {!isScanning && (
                <Pressable onPress={() => setIsScanning(true)}>
                  <Text className="text-primary font-bold">Rescan</Text>
                </Pressable>
              )}
            </View>
            
            {devices.map((device, index) => (
              <Animated.View 
                key={device.id}
                entering={FadeInDown.delay(index * 150)}
              >
                <CardPanel intensity={10} className="mb-4">
                  <View className="flex-row items-center">
                    <View className={`w-14 h-14 rounded-2xl ${device.color || "bg-primary"} items-center justify-center shadow-lg shadow-blue-500/10`}>
                      <MaterialCommunityIcons name={device.icon as any} size={28} color="white" />
                    </View>
                    <View className="flex-1 ml-4">
                      <Text className="text-black font-bold text-lg">{device.name}</Text>
                      <View className="flex-row items-center">
                        <View className={`w-2 h-2 rounded-full ${device.status === "nearby" ? "bg-green-500" : "bg-gray-300"} mr-2`} />
                        <Text className="text-gray-400 text-sm font-medium">{device.status}</Text>
                      </View>
                    </View>
                    <Pressable 
                      onPress={() => router.push({ pathname: "/precision", params: { id: device.id } })}
                      className="bg-primary/10 px-6 py-3 rounded-2xl"
                    >
                      <Text className="text-primary font-bold">Precision</Text>
                    </Pressable>
                  </View>
                </CardPanel>
              </Animated.View>
            ))}
          </View>

          <View className="h-20" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
