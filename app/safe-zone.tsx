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
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="px-6 flex-row justify-between items-center h-16">
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
            <MaterialCommunityIcons name="close" size={28} color="black" />
          </Pressable>
          <Text className="text-black text-xl font-bold">New Safe Zone</Text>
          <Pressable onPress={handleSave} className="bg-primary px-4 py-2 rounded-xl">
            <Text className="text-white font-bold">Save</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="h-80 w-full bg-gray-100 mb-6">
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
                <View className="w-8 h-8 rounded-full bg-primary border-4 border-white shadow-lg items-center justify-center">
                  <MaterialCommunityIcons name="home" size={16} color="white" />
                </View>
              </Marker>
              <Circle
                center={location}
                radius={radius}
                strokeColor="rgba(0, 102, 204, 0.5)"
                fillColor="rgba(0, 102, 204, 0.1)"
              />
            </MapView>
            <View className="absolute bottom-4 left-4 right-4 bg-white/90 p-3 rounded-2xl border border-white/20">
              <Text className="text-gray-500 text-xs font-bold uppercase text-center">Tap or drag to set center</Text>
            </View>
          </View>

          <View className="px-8">
            <Animated.View entering={FadeInDown.delay(100)} className="mb-8">
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Zone Name</Text>
              <TextInput
                className="bg-gray-50 p-5 rounded-2xl text-lg text-black border border-gray-100"
                value={name}
                onChangeText={setName}
                placeholder="e.g. Home, Office, Park"
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200)} className="mb-8">
              <View className="flex-row justify-between items-end mb-3">
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">Radius</Text>
                <Text className="text-primary font-bold">{radius}m</Text>
              </View>
              <View className="flex-row items-center justify-between">
                {[100, 200, 500, 1000].map((val) => (
                  <Pressable 
                    key={val}
                    onPress={() => setRadius(val)}
                    className={`px-4 py-3 rounded-xl border ${radius === val ? "bg-primary border-primary" : "bg-white border-gray-100"}`}
                  >
                    <Text className={`font-bold ${radius === val ? "text-white" : "text-gray-400"}`}>{val}m</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300)} className="mb-8 bg-blue-50 p-6 rounded-3xl border border-blue-100">
              <View className="flex-row items-center mb-2">
                <MaterialCommunityIcons name="bell-ring-outline" size={20} color={colors.primary} />
                <Text className="ml-2 text-primary font-bold text-lg">Smart Alert</Text>
              </View>
              <Text className="text-blue-900/60 leading-5">
                You will receive a critical notification if <Text className="font-bold">{device?.name || "the tag"}</Text> leaves this {radius}m perimeter.
              </Text>
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
