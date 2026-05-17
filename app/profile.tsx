import React from "react";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, Image, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
      className="flex-row items-center py-4 border-b border-[#f3f4f9] active:bg-[#f7f9fc] px-4"
    >
      <View className={`w-10 h-10 rounded-xl ${color || "bg-[#e8f0fe]"} items-center justify-center`}>
        <MaterialCommunityIcons name={icon} size={22} color={color ? "white" : "#0066cc"} />
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-[#1c1b1f] font-semibold text-base">{label}</Text>
        {sublabel && <Text className="text-[#49454f] text-xs mt-0.5">{sublabel}</Text>}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#93909a" />
    </Pressable>
  );

  return (
    <View className="flex-1 bg-[#f7f9fc]"> {/* Material 3 Surface Tone */}
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View className="px-6 pt-4 flex-row justify-between items-center h-16">
            <Pressable 
              onPress={() => router.back()} 
              className="w-10 h-10 rounded-full bg-white shadow-sm items-center justify-center"
            >
              <MaterialCommunityIcons name="chevron-left" size={24} color="#1c1b1f" />
            </Pressable>
            <Text className="text-[#1c1b1f] font-bold text-lg">Profile</Text>
            <Pressable className="w-10 h-10 rounded-full bg-white shadow-sm items-center justify-center">
              <MaterialCommunityIcons name="pencil-outline" size={18} color="#1c1b1f" />
            </Pressable>
          </View>

          {/* User Hero */}
          <View className="items-center justify-center py-6">
            <View className="relative">
              <View className="w-28 h-28 rounded-full border-4 border-[#e8f0fe] p-1 bg-white shadow-sm">
                {user?.avatar ? (
                  <Image 
                    source={{ uri: user.avatar }}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <View className="w-full h-full rounded-full bg-[#f3f4f9] items-center justify-center">
                    <MaterialCommunityIcons name="account" size={56} color="#93909a" />
                  </View>
                )}
              </View>
              <View className="absolute bottom-0 right-0 w-8 h-8 bg-[#0066cc] rounded-full border-4 border-white items-center justify-center shadow-sm">
                <MaterialCommunityIcons name="check" size={14} color="white" />
              </View>
            </View>
            <Text className="text-[#1c1b1f] text-2xl font-bold mt-4">{user?.displayName || "NovaTag User"}</Text>
            <Text className="text-[#49454f] font-medium mt-0.5 text-sm">{user?.email || "user@novatag.com"}</Text>
          </View>

          {/* Stats Row - Material 3 Style */}
          <View className="flex-row px-6 mb-6">
            <View className="flex-1 bg-white p-4 rounded-[24px] items-center mx-1 shadow-sm">
              <Text className="text-[#0066cc] text-xl font-bold">{devices.length}</Text>
              <Text className="text-[#49454f] text-[10px] font-bold uppercase tracking-widest mt-0.5">Tags</Text>
            </View>
            <View className="flex-1 bg-white p-4 rounded-[24px] items-center mx-1 shadow-sm">
              <Text className="text-[#0066cc] text-xl font-bold">
                {devices.length > 0 ? Math.round(devices.reduce((acc, d) => acc + d.battery, 0) / devices.length) : 0}%
              </Text>
              <Text className="text-[#49454f] text-[10px] font-bold uppercase tracking-widest mt-0.5">Avg Bat</Text>
            </View>
            <View className="flex-1 bg-white p-4 rounded-[24px] items-center mx-1 shadow-sm">
              <Text className="text-[#0066cc] text-xl font-bold">0</Text>
              <Text className="text-[#49454f] text-[10px] font-bold uppercase tracking-widest mt-0.5">Alerts</Text>
            </View>
          </View>

          {/* Menu Sections */}
          <View className="px-6 space-y-6">
            
            {/* Ecosystem */}
            <View>
              <Text className="text-[#49454f] text-xs font-bold uppercase tracking-widest ml-2 mb-2">Ecosystem</Text>
              <View className="bg-white rounded-[28px] overflow-hidden shadow-sm">
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
              </View>
            </View>

            {/* Subscription */}
            <View className="mt-4">
              <Text className="text-[#49454f] text-xs font-bold uppercase tracking-widest ml-2 mb-2">Subscription</Text>
              <Pressable 
                onPress={() => router.push("/subscription")}
                className="bg-[#0066cc] p-5 rounded-[28px] flex-row items-center justify-between shadow-sm"
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                    <MaterialCommunityIcons name="crown-outline" size={22} color="white" />
                  </View>
                  <View className="ml-3">
                    <Text className="text-white font-bold text-base">{user?.premium ? "NovaTag Pro" : "Free Plan"}</Text>
                    <Text className="text-white/80 text-xs">{user?.premium ? "Active until June 2026" : "Upgrade for more"}</Text>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="white" />
              </Pressable>
            </View>

            {/* Support */}
            <View className="mt-4">
              <Text className="text-[#49454f] text-xs font-bold uppercase tracking-widest ml-2 mb-2">Support</Text>
              <View className="bg-white rounded-[28px] overflow-hidden shadow-sm">
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
              </View>
            </View>

            {/* Sign Out */}
            <Pressable 
              onPress={handleSignOut}
              className="py-6 items-center"
            >
              <Text className="text-[#ba1a1a] font-bold text-base">Sign Out</Text>
              <Text className="text-[#93909a] text-xs mt-0.5">Version 1.0.42 (Production)</Text>
            </Pressable>

            <View className="h-10" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
