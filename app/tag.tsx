import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardPanel } from "@components/CardPanel";
import Animated, { FadeInDown } from "react-native-reanimated";
import { colors } from "@theme/colors";
import { useDeviceStore } from "@store/useDeviceStore";
import { useToastStore } from "@store/useToastStore";

export default function TagDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const showToast = useToastStore((state) => state.show);
  const device = useDeviceStore((state) => state.devices.find(d => d.id === id));
  const removeSafeZone = useDeviceStore((state) => state.removeSafeZone);

  if (!device) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const ActionButton = ({ icon, label, onPress, color }: any) => (
    <Pressable 
      onPress={onPress}
      className="items-center justify-center flex-1"
    >
      <View className={`w-14 h-14 rounded-full items-center justify-center ${color || "bg-gray-100"} active:opacity-80`}>
        <MaterialCommunityIcons name={icon} size={28} color={color ? "white" : "black"} />
      </View>
      <Text className="text-black font-semibold mt-2 text-sm">{label}</Text>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-8 pt-4 flex-row justify-between items-center">
            <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
              <MaterialCommunityIcons name="chevron-left" size={28} color="black" />
            </Pressable>
            <Pressable onPress={() => router.push({ pathname: "/device-settings", params: { deviceId: device.id } })} className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
              <MaterialCommunityIcons name="dots-horizontal" size={24} color="black" />
            </Pressable>
          </View>

          {/* Tag Hero */}
          <View className="items-center justify-center py-12">
            <Animated.View entering={FadeInDown.duration(800)} className="items-center">
              <View className={`w-40 h-40 rounded-[48px] ${device.color || "bg-primary"} items-center justify-center shadow-2xl shadow-blue-500/20`}>
                <MaterialCommunityIcons name={device.icon as any} size={80} color="white" />
              </View>
              <Text className="text-black text-4xl font-bold mt-8">{device.name}</Text>
              <View className="flex-row items-center mt-2">
                <View className={`w-2 h-2 rounded-full ${device.status === "nearby" ? "bg-green-500" : "bg-gray-300"} mr-2`} />
                <Text className="text-gray-400 font-medium">{device.status} • {device.lastSeen}</Text>
              </View>
            </Animated.View>
          </View>

          {/* Quick Actions */}
          <View className="px-8 flex-row justify-between mb-10">
            <ActionButton 
              icon="volume-high" 
              label="Play Sound" 
              onPress={() => {
                showToast(`Pinging ${device.name}...`, "info");
              }} 
              color="bg-primary"
            />
            <ActionButton 
              icon="radar" 
              label="Find Nearby" 
              onPress={() => router.push("/precision")} 
            />
            <ActionButton 
              icon="map-marker-outline" 
              label="Directions" 
              onPress={() => router.push("/map")} 
            />
            <ActionButton 
              icon="share-variant-outline" 
              label="Share" 
              onPress={() => showToast("Coming soon!", "info")} 
            />
          </View>

          {/* Details Sections */}
          <View className="px-6 space-y-4">
            <CardPanel intensity={10}>
              <Text className="text-black font-bold text-lg mb-4">Device Health</Text>
              <View className="flex-row justify-between items-center py-3 border-b border-gray-50">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons 
                    name={device.battery > 80 ? "battery-high" : device.battery > 20 ? "battery-medium" : "battery-low"} 
                    size={20} 
                    color={device.battery > 20 ? "#34c759" : "#ff3b30"} 
                  />
                  <Text className="ml-3 text-gray-600 font-medium">Battery</Text>
                </View>
                <Text className="text-black font-bold">{device.battery}%</Text>
              </View>
              <View className="flex-row justify-between items-center py-3 border-b border-gray-50">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="update" size={20} color="#0066cc" />
                  <Text className="ml-3 text-gray-600 font-medium">Firmware</Text>
                </View>
                <Pressable onPress={() => router.push({ pathname: "/ota-update", params: { deviceId: device.id } })}>
                  <Text className="text-primary font-bold">{device.firmware}</Text>
                </Pressable>
              </View>
              <View className="flex-row justify-between items-center py-3">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="shield-check-outline" size={20} color="#34c759" />
                  <Text className="ml-3 text-gray-600 font-medium">Security</Text>
                </View>
                <Text className="text-green-500 font-bold">Encrypted</Text>
              </View>
            </CardPanel>

            {/* Safe Zones Section */}
            <CardPanel intensity={10} className="mt-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-black font-bold text-lg">Safe Zones</Text>
                <Pressable onPress={() => router.push({ pathname: "/safe-zone", params: { deviceId: device.id } })}>
                  <Text className="text-primary font-bold">Add Zone</Text>
                </Pressable>
              </View>
              
              {device.safeZones && device.safeZones.length > 0 ? (
                device.safeZones.map((zone) => (
                  <View key={zone.id} className="flex-row items-center py-3 border-b border-gray-50">
                    <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
                      <MaterialCommunityIcons name="shield-home-outline" size={20} color={colors.primary} />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="text-black font-semibold">{zone.name}</Text>
                      <Text className="text-gray-400 text-xs">{zone.radius}m perimeter • Active</Text>
                    </View>
                    <Pressable onPress={() => removeSafeZone(device.id, zone.id)}>
                      <MaterialCommunityIcons name="trash-can-outline" size={20} color="#ff3b30" />
                    </Pressable>
                  </View>
                ))
              ) : (
                <View className="py-4 items-center">
                  <Text className="text-gray-400 text-sm italic">No safe zones defined</Text>
                </View>
              )}
            </CardPanel>

            <Pressable 
              onPress={() => router.push({ pathname: "/lost-mode", params: { deviceId: device.id } })}
              className="mt-6 bg-red-50 p-6 rounded-[32px] border border-red-100 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-red-500 items-center justify-center">
                  <MaterialCommunityIcons name="lock-outline" size={24} color="white" />
                </View>
                <View className="ml-4">
                  <Text className="text-red-600 font-bold text-lg">Lost Mode</Text>
                  <Text className="text-red-400 text-sm">Lock and protect this tag</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#ff3b30" />
            </Pressable>

            <View className="h-20" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
