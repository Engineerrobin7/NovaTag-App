import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ScrollView, Text, Image, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardPanel } from "@components/CardPanel";
import { colors } from "@theme/colors";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useDeviceStore } from "@store/useDeviceStore";
import { useAuthStore } from "@store/useAuthStore";
import { useToastStore } from "@store/useToastStore";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const devices = useDeviceStore((state) => state.devices);
  const syncWithFirebase = useDeviceStore((state) => state.syncWithFirebase);
  const user = useAuthStore((state) => state.user);
  const showToast = useToastStore((state) => state.show);

  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = syncWithFirebase(user.uid);
      return () => unsubscribe();
    }
  }, [user?.uid]);

  const QuickAction = ({ icon, label, onPress, color }: any) => (
    <Pressable 
      onPress={onPress}
      className="items-center justify-center bg-gray-50 rounded-[28px] p-6 flex-1 mx-1 active:bg-gray-100"
    >
      <View className={`w-12 h-12 rounded-full items-center justify-center ${color || "bg-white"}`}>
        <MaterialCommunityIcons name={icon} size={24} color={color ? "white" : "black"} />
      </View>
      <Text className="text-black font-semibold mt-3">{label}</Text>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header */}
          <View className="px-8 pt-8 flex-row justify-between items-center">
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Good Morning</Text>
                <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="weather-partly-cloudy" size={12} color="#7a7a7a" />
                  <Text className="text-gray-400 font-bold ml-1 text-[10px]">22°C • London</Text>
                </View>
              </View>
              <Text className="text-black text-3xl font-bold">{user?.displayName || "User"}</Text>
            </View>
            <Pressable 
              onPress={() => router.push("/profile")}
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-100"
            >
              {user?.avatar ? (
                <Image 
                  source={{ uri: user.avatar }}
                  className="w-full h-full"
                />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <MaterialCommunityIcons name="account" size={32} color="#ccc" />
                </View>
              )}
            </Pressable>
          </View>

          {/* Map Preview Card */}
          <Animated.View entering={FadeInDown.delay(200)} className="px-6 mt-8">
            <Pressable onPress={() => router.push("/map")}>
              <CardPanel className="p-0 h-64 overflow-hidden">
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" }}
                  className="w-full h-full opacity-90"
                  resizeMode="cover"
                />
                <View className="absolute inset-0 bg-black/10" />
                <View className="absolute top-6 left-6">
                  <BlurView intensity={30} tint="dark" className="px-4 py-2 rounded-full overflow-hidden">
                    <Text className="text-white font-semibold">Live Map</Text>
                  </BlurView>
                </View>
                <View className="absolute bottom-6 left-6 right-6 flex-row justify-between items-end">
                  <View>
                    <Text className="text-white text-2xl font-bold">
                      {devices.every(d => d.status === "nearby") ? "All Devices Safe" : "Action Required"}
                    </Text>
                    <Text className="text-white/70">
                      {devices.length} {devices.length === 1 ? "device" : "devices"} tracked
                    </Text>
                  </View>
                  <View className="bg-white rounded-full p-3 shadow-lg">
                    <MaterialCommunityIcons name="arrow-top-right" size={24} color="black" />
                  </View>
                </View>
              </CardPanel>
            </Pressable>
          </Animated.View>

          {/* Devices Horizontal Scroll */}
          <View className="mt-10">
            <View className="px-8 flex-row justify-between items-end mb-4">
              <Text className="text-black text-2xl font-bold">Your Devices</Text>
              <Pressable onPress={() => router.push("/add-device")}>
                <Text className="text-primary font-semibold">Add New</Text>
              </Pressable>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}
            >
              {devices.length > 0 ? (
                devices.map((device, index) => (
                  <Animated.View 
                    key={device.id} 
                    entering={FadeInRight.delay(400 + index * 100)}
                  >
                    <Pressable 
                      onPress={() => router.push({ pathname: "/tag", params: { id: device.id } })}
                      className="mr-4"
                    >
                      <CardPanel className="w-48" intensity={20}>
                        <View className={`w-12 h-12 rounded-2xl items-center justify-center ${device.color} mb-4`}>
                          <MaterialCommunityIcons name={device.icon as any} size={28} color="white" />
                        </View>
                        <Text className="text-black text-xl font-bold" numberOfLines={1}>{device.name}</Text>
                        <View className="flex-row items-center mt-1">
                          <View className={`w-2 h-2 rounded-full ${device.status === "nearby" ? "bg-green-500" : "bg-gray-300"} mr-2`} />
                          <Text className="text-gray-400 text-sm font-medium">{device.status}</Text>
                        </View>
                        <View className="mt-6 flex-row items-center justify-between">
                          <View className="flex-row items-center">
                            <MaterialCommunityIcons 
                              name={device.battery > 80 ? "battery-high" : device.battery > 20 ? "battery-medium" : "battery-low"} 
                              size={16} 
                              color={device.battery > 20 ? "#34c759" : "#ff3b30"} 
                            />
                            <Text className="text-gray-500 text-xs ml-1">{device.battery}%</Text>
                          </View>
                          <Text className="text-gray-400 text-[10px] uppercase tracking-tighter">{device.lastSeen}</Text>
                        </View>
                      </CardPanel>
                    </Pressable>
                  </Animated.View>
                ))
              ) : (
                <View className="px-4 py-8 items-center justify-center w-[width-48]">
                  <Text className="text-gray-400 italic">No devices paired yet</Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Quick Actions */}
          <View className="px-6 mt-10">
            <Text className="px-2 text-black text-2xl font-bold mb-4">Actions</Text>
            <View className="flex-row">
              <QuickAction 
                icon="radar" 
                label="Nearby" 
                color="bg-primary"
                onPress={() => router.push("/nearby")} 
              />
              <QuickAction 
                icon="bell-ring-outline" 
                label="Alerts" 
                onPress={() => router.push("/alerts")} 
              />
              <QuickAction 
                icon="shield-check-outline" 
                label="SOS" 
                color="bg-red-500"
                onPress={() => {
                  const showToast = useToastStore.getState().show;
                  showToast("SOS Signal Broadcasted!", "error");
                  // In real app, we would loop through devices and call bleService.triggerBuzzer(d.id, true)
                }} 
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Floating Bottom Nav - Glass effect */}
      <View className="absolute bottom-8 left-8 right-8 h-20 rounded-[32px] overflow-hidden border border-gray-100/20 shadow-2xl">
        <BlurView intensity={60} tint="light" className="flex-1 flex-row items-center justify-around px-4">
          <Pressable className="items-center">
            <MaterialCommunityIcons name="home-variant" size={28} color="#0066cc" />
            <View className="w-1 h-1 rounded-full bg-primary mt-1" />
          </Pressable>
          <Pressable onPress={() => router.push("/map")} className="items-center">
            <MaterialCommunityIcons name="map-marker-radius-outline" size={28} color="#7a7a7a" />
          </Pressable>
          <Pressable onPress={() => router.push("/nearby")} className="bg-primary w-14 h-14 rounded-full items-center justify-center -mt-8 shadow-lg shadow-primary/40">
            <MaterialCommunityIcons name="scan-helper" size={28} color="white" />
          </Pressable>
          <Pressable onPress={() => router.push("/notifications")} className="items-center">
            <MaterialCommunityIcons name="bell-outline" size={28} color="#7a7a7a" />
          </Pressable>
          <Pressable onPress={() => router.push("/settings")} className="items-center">
            <MaterialCommunityIcons name="cog-outline" size={28} color="#7a7a7a" />
          </Pressable>
        </BlurView>
      </View>
    </View>
  );
}
