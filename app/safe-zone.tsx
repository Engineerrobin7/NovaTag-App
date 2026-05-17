import React, { useState, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, Pressable, ScrollView, TextInput, Dimensions } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDeviceStore } from "@store/useDeviceStore";
import { useToastStore } from "@store/useToastStore";
import Animated, { FadeInDown } from "react-native-reanimated";
import { colors } from "@theme/colors";

const { width } = Dimensions.get("window");

export default function SafeZoneScreen() {
  const router = useRouter();
  const { deviceId } = useLocalSearchParams<{ deviceId: string }>();
  const showToast = useToastStore((state) => state.show);
  const addSafeZone = useDeviceStore((state) => state.addSafeZone);
  const device = useDeviceStore((state) => state.devices.find(d => d.id === deviceId));

  const [name, setName] = useState("Home");
  const [radius, setRadius] = useState(200); // meters
  const [location, setLocation] = useState({
    latitude: device?.lat || 51.5074,
    longitude: device?.lng || -0.1278
  });

  const handleSave = async () => {
    if (!name) {
      showToast("Please enter a name for this zone", "warning");
      return;
    }

    const newZone = {
      id: Math.random().toString(36).substring(7),
      name,
      center: location,
      radius,
      type: "exit" as const,
      enabled: true
    };

    try {
      await addSafeZone(deviceId, newZone);
      showToast(`${name} Safe Zone created!`, "success");
      router.back();
    } catch (e) {
      showToast("Failed to create safe zone", "error");
    }
  };

  return (
    <View className="flex-1 bg-[#f7f9fc]"> {/* Material 3 Surface Tone */}
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Material 3 Large Top App Bar */}
        <View className="px-6 flex-row justify-between items-center h-20">
          <Pressable 
            onPress={() => router.back()} 
            className="w-12 h-12 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <MaterialCommunityIcons name="close" size={24} color="#1c1b1f" />
          </Pressable>
          <Text className="text-[#1c1b1f] text-2xl font-semibold">New Safe Zone</Text>
          <Pressable 
            onPress={handleSave} 
            className="bg-[#0066cc] px-6 py-3 rounded-full shadow-md"
          >
            <Text className="text-white font-bold">Save</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Map Section with Material 3 card style */}
          <View className="mx-6 h-80 rounded-[28px] overflow-hidden bg-white shadow-sm mb-6">
            <MapView
              className="flex-1"
              initialRegion={{
                ...location,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              }}
              onPress={(e) => setLocation(e.nativeEvent.coordinate)}
            >
              <Marker coordinate={location} draggable onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)}>
                <View className="w-10 h-10 rounded-full bg-[#0066cc] border-4 border-white shadow-lg items-center justify-center">
                  <MaterialCommunityIcons name="home" size={18} color="white" />
                </View>
              </Marker>
              <Circle
                center={location}
                radius={radius}
                strokeColor="rgba(0, 102, 204, 0.5)"
                fillColor="rgba(0, 102, 204, 0.1)"
              />
            </MapView>
            <View className="absolute bottom-4 left-4 right-4 bg-white/90 p-3 rounded-full border border-white/20">
              <Text className="text-[#49454f] text-xs font-medium text-center">Tap or drag to set center</Text>
            </View>
          </View>

          <View className="px-6">
            {/* Input Section - Material 3 Style */}
            <Animated.View entering={FadeInDown.delay(100)} className="mb-6 bg-white p-6 rounded-[28px] shadow-sm">
              <Text className="text-[#49454f] text-xs font-bold uppercase tracking-widest mb-3">Zone Name</Text>
              <TextInput
                className="bg-[#f3f4f9] p-4 rounded-xl text-lg text-[#1c1b1f]"
                value={name}
                onChangeText={setName}
                placeholder="e.g. Home, Office, Park"
                placeholderTextColor="#93909a"
              />
            </Animated.View>

            {/* Radius Section - Material 3 Style */}
            <Animated.View entering={FadeInDown.delay(200)} className="mb-6 bg-white p-6 rounded-[28px] shadow-sm">
              <View className="flex-row justify-between items-end mb-4">
                <Text className="text-[#49454f] text-xs font-bold uppercase tracking-widest">Radius</Text>
                <Text className="text-[#0066cc] font-bold text-lg">{radius}m</Text>
              </View>
              <View className="flex-row items-center justify-between">
                {[100, 200, 500, 1000].map((val) => (
                  <Pressable 
                    key={val}
                    onPress={() => setRadius(val)}
                    className={`px-5 py-3 rounded-full border ${radius === val ? "bg-[#0066cc] border-[#0066cc]" : "bg-[#f3f4f9] border-transparent"}`}
                  >
                    <Text className={`font-bold ${radius === val ? "text-white" : "text-[#49454f]"}`}>{val}m</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>

            {/* Info Card - Material 3 Style */}
            <Animated.View entering={FadeInDown.delay(300)} className="mb-8 bg-[#e8f0fe] p-6 rounded-[28px] border border-[#c2e7ff]">
              <View className="flex-row items-center mb-2">
                <MaterialCommunityIcons name="bell-ring-outline" size={24} color="#0066cc" />
                <Text className="ml-2 text-[#0066cc] font-bold text-lg">Smart Alert</Text>
              </View>
              <Text className="text-[#041e49] leading-5">
                You will receive a critical notification if <Text className="font-bold">{device?.name || "the tag"}</Text> leaves this {radius}m perimeter.
              </Text>
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
