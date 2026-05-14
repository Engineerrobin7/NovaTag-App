import React from "react";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, Image, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardPanel } from "@components/CardPanel";
import { useAuthStore } from "@store/useAuthStore";
import { useDeviceStore } from "@store/useDeviceStore";
import { useToastStore } from "@store/useToastStore";
import { auth } from "@services/firebase";
import { signOut } from "firebase/auth";

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const devices = useDeviceStore((state) => state.devices);

  const showToast = useToastStore((state) => state.show);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      logout();
      router.replace("/welcome");
      showToast("Signed out successfully", "success");
    } catch (error) {
      showToast("Failed to sign out", "error");
    }
  };

  const MenuItem = ({ icon, label, sublabel, onPress, color }: any) => (
    <Pressable 
      onPress={onPress}
      className="flex-row items-center py-4 border-b border-gray-50 active:bg-gray-50 rounded-xl"
    >
      <View className={`w-10 h-10 rounded-xl ${color || "bg-gray-100"} items-center justify-center`}>
        <MaterialCommunityIcons name={icon} size={22} color={color ? "white" : "#7a7a7a"} />
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-black font-semibold text-lg">{label}</Text>
        {sublabel && <Text className="text-gray-400 text-xs">{sublabel}</Text>}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#d1d1d6" />
    </Pressable>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-8 pt-4 flex-row justify-between items-center">
            <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
              <MaterialCommunityIcons name="chevron-left" size={28} color="black" />
            </Pressable>
            <Text className="text-black font-bold text-lg">Profile</Text>
            <Pressable className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
              <MaterialCommunityIcons name="pencil-outline" size={20} color="black" />
            </Pressable>
          </View>

          {/* User Hero */}
          <View className="items-center justify-center py-10">
            <View className="relative">
              <View className="w-32 h-32 rounded-full border-4 border-primary/10 p-1">
                {user?.avatar ? (
                  <Image 
                    source={{ uri: user.avatar }}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <View className="w-full h-full rounded-full bg-gray-100 items-center justify-center">
                    <MaterialCommunityIcons name="account" size={64} color="#ccc" />
                  </View>
                )}
              </View>
              <View className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full border-4 border-white items-center justify-center">
                <MaterialCommunityIcons name="check" size={16} color="white" />
              </View>
            </View>
            <Text className="text-black text-3xl font-bold mt-6">{user?.displayName || "NovaTag User"}</Text>
            <Text className="text-gray-400 font-medium mt-1">{user?.email || "user@novatag.com"}</Text>
          </View>

          {/* Stats Row */}
          <View className="flex-row px-6 mb-8">
            <View className="flex-1 bg-gray-50 p-4 rounded-3xl items-center mx-1">
              <Text className="text-primary text-xl font-bold">{devices.length}</Text>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Tags</Text>
            </View>
            <View className="flex-1 bg-gray-50 p-4 rounded-3xl items-center mx-1">
              <Text className="text-primary text-xl font-bold">
                {devices.length > 0 ? Math.round(devices.reduce((acc, d) => acc + d.battery, 0) / devices.length) : 0}%
              </Text>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Avg Bat</Text>
            </View>
            <View className="flex-1 bg-gray-50 p-4 rounded-3xl items-center mx-1">
              <Text className="text-primary text-xl font-bold">0</Text>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Alerts</Text>
            </View>
          </View>

          {/* Menu Sections */}
          <View className="px-6 space-y-8">
            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-2 mb-4">Ecosystem</Text>
              <CardPanel intensity={10}>
                <MenuItem 
                  icon="account-group-outline" 
                  label="Family Sharing" 
                  sublabel="Manage shared devices and members"
                  onPress={() => router.push("/family")}
                />
                <MenuItem 
                  icon="shield-check-outline" 
                  label="Privacy & Security" 
                  sublabel="Two-factor auth and encryption"
                  onPress={() => {}}
                />
                <MenuItem 
                  icon="bell-ring-outline" 
                  label="Notification Settings" 
                  sublabel="Customize alerts and safe zones"
                  onPress={() => router.push("/settings")}
                />
              </CardPanel>
            </View>

            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-2 mb-4">Subscription</Text>
              <Pressable 
                onPress={() => router.push("/subscription")}
                className="bg-black p-6 rounded-[32px] flex-row items-center justify-between shadow-xl shadow-black/20"
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-full bg-amber-400 items-center justify-center">
                    <MaterialCommunityIcons name="crown-outline" size={24} color="black" />
                  </View>
                  <View className="ml-4">
                    <Text className="text-white font-bold text-lg">{user?.premium ? "NovaTag Pro" : "Free Plan"}</Text>
                    <Text className="text-white/40 text-sm">{user?.premium ? "Active until June 2026" : "Upgrade for more"}</Text>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
              </Pressable>
            </View>

            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-2 mb-4">Support</Text>
              <CardPanel intensity={10}>
                <MenuItem 
                  icon="help-circle-outline" 
                  label="Help Center" 
                  onPress={() => router.push("/support")}
                />
                <MenuItem 
                  icon="message-outline" 
                  label="Contact Support" 
                  onPress={() => router.push("/support")}
                />
              </CardPanel>
            </View>

            <Pressable 
              onPress={handleSignOut}
              className="py-8 items-center"
            >
              <Text className="text-red-500 font-bold text-lg">Sign Out</Text>
              <Text className="text-gray-400 text-xs mt-1">Version 1.0.42 (Production)</Text>
            </Pressable>

            <View className="h-10" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

