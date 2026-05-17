import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ScrollView, Text, Image, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
      className="items-center justify-center bg-white rounded-[28px] p-6 flex-1 mx-1 shadow-sm active:bg-[#f3f4f9]"
    >
      <View className={`w-12 h-12 rounded-full items-center justify-center ${color || "bg-[#e8f0fe]"}`}>
        <MaterialCommunityIcons name={icon} size={24} color={color ? "white" : "#0066cc"} />
      </View>
      <Text className="text-[#1c1b1f] font-semibold mt-3 text-sm">{label}</Text>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-[#f7f9fc]"> {/* Material 3 Surface Tone */}
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Header - Material 3 Large Title style */}
          <View className="px-6 pt-6 flex-row justify-between items-center">
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-[#49454f] font-bold uppercase tracking-widest text-[10px]">Good Morning</Text>
                <View className="w-1 h-1 rounded-full bg-[#93909a] mx-2" />
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="weather-partly-cloudy" size={12} color="#49454f" />
                  <Text className="text-[#49454f] font-bold ml-1 text-[10px]">22°C • London</Text>
                </View>
              </View>
              <Text className="text-[#1c1b1f] text-3xl font-bold">{user?.displayName || "User"}</Text>
            </View>
            <Pressable 
              onPress={() => router.push("/profile")}
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white"
            >
              {user?.avatar ? (
                <Image 
                  source={{ uri: user.avatar }}
                  className="w-full h-full"
                />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <MaterialCommunityIcons name="account" size={28} color="#93909a" />
                </View>
              )}
            </Pressable>
          </View>

          {/* Map Preview Card - Material 3 Elevating Card */}
          <Animated.View entering={FadeInDown.delay(200)} className="px-6 mt-6">
            <Pressable onPress={() => router.push("/map")}>
              <View className="bg-white rounded-[28px] h-64 overflow-hidden shadow-sm">
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" }}
                  className="w-full h-full opacity-90"
                  resizeMode="cover"
                />
                <View className="absolute inset-0 bg-black/5" />
                <View className="absolute top-4 left-4">
                  <View className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                    <Text className="text-white text-xs font-semibold">Live Map</Text>
                  </View>
                </View>
                <View className="absolute bottom-4 left-4 right-4 flex-row justify-between items-end">
                  <View>
                    <Text className="text-white text-xl font-bold">
                      {devices.every(d => d.status === "nearby") ? "All Devices Safe" : "Action Required"}
                    </Text>
                    <Text className="text-white/80 text-sm">
                      {devices.length} {devices.length === 1 ? "device" : "devices"} tracked
                    </Text>
                  </View>
                  <View className="bg-white rounded-full p-3 shadow-md">
                    <MaterialCommunityIcons name="arrow-top-right" size={20} color="#1c1b1f" />
                  </View>
                </View>
              </View>
            </Pressable>
          </Animated.View>

          {/* Devices Horizontal Scroll */}
          <View className="mt-8">
            <View className="px-6 flex-row justify-between items-end mb-4">
              <Text className="text-[#1c1b1f] text-2xl font-bold">Your Devices</Text>
              <Pressable onPress={() => router.push("/add-device")}>
                <Text className="text-[#0066cc] font-semibold text-sm">Add New</Text>
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
                      <View className="w-44 bg-white p-5 rounded-[28px] shadow-sm">
                        <View className={`w-10 h-10 rounded-xl items-center justify-center ${device.color} mb-4`}>
                          <MaterialCommunityIcons name={device.icon as any} size={24} color="white" />
                        </View>
                        <Text className="text-[#1c1b1f] text-lg font-bold" numberOfLines={1}>{device.name}</Text>
                        <View className="flex-row items-center mt-1">
                          <View className={`w-2 h-2 rounded-full ${device.status === "nearby" ? "bg-[#34c759]" : "bg-[#93909a]"} mr-2`} />
                          <Text className="text-[#49454f] text-xs font-medium">{device.status}</Text>
                        </View>
                        <View className="mt-4 flex-row items-center justify-between">
                          <View className="flex-row items-center">
                            <MaterialCommunityIcons 
                              name={device.battery > 80 ? "battery-high" : device.battery > 20 ? "battery-medium" : "battery-low"} 
                              size={14} 
                              color={device.battery > 20 ? "#34c759" : "#ba1a1a"} 
                            />
                            <Text className="text-[#49454f] text-xs ml-1">{device.battery}%</Text>
                          </View>
                          <Text className="text-[#93909a] text-[10px] uppercase font-medium">{device.lastSeen}</Text>
                        </View>
                      </View>
                    </Pressable>
                  </Animated.View>
                ))
              ) : (
                <View className="px-4 py-8 items-center justify-center" style={{ width: width - 48 }}>
                  <Text className="text-[#93909a] italic">No devices paired yet</Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Quick Actions */}
          <View className="px-6 mt-8">
            <Text className="text-[#1c1b1f] text-2xl font-bold mb-4">Actions</Text>
            <View className="flex-row justify-between">
              <QuickAction 
                icon="radar" 
                label="Nearby" 
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
                color="#ba1a1a"
                onPress={() => {
                  showToast("SOS Signal Broadcasted!", "error");
                }} 
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Floating Bottom Nav - Material 3 Style */}
      <View className="absolute bottom-6 left-6 right-6 h-16 rounded-full overflow-hidden shadow-lg border border-white/20">
        <BlurView intensity={90} tint="light" className="flex-1 flex-row items-center justify-around px-2">
          <Pressable className="items-center justify-center w-12 h-12">
            <MaterialCommunityIcons name="home-variant" size={24} color="#0066cc" />
            <View className="w-1.5 h-1.5 rounded-full bg-[#0066cc] mt-0.5" />
          </Pressable>
          
          <Pressable onPress={() => router.push("/map")} className="items-center justify-center w-12 h-12">
            <MaterialCommunityIcons name="map-marker-radius-outline" size={24} color="#49454f" />
          </Pressable>
          
          <Pressable 
            onPress={() => router.push("/nearby")} 
            className="bg-[#0066cc] w-12 h-12 rounded-full items-center justify-center shadow-md"
          >
            <MaterialCommunityIcons name="scan-helper" size={24} color="white" />
          </Pressable>
          
          <Pressable onPress={() => router.push("/notifications")} className="items-center justify-center w-12 h-12">
            <MaterialCommunityIcons name="bell-outline" size={24} color="#49454f" />
          </Pressable>
          
          <Pressable onPress={() => router.push("/settings")} className="items-center justify-center w-12 h-12">
            <MaterialCommunityIcons name="cog-outline" size={24} color="#49454f" />
          </Pressable>
        </BlurView>
      </View>
    </View>
  );
}
