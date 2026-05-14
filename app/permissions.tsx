import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePermissions } from "@hooks/usePermissions";
import { colors } from "@theme/colors";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PermissionsScreen() {
  const router = useRouter();
  const status = usePermissions();

  useEffect(() => {
    if (status.location && status.notifications && status.bluetooth) {
      const timeout = setTimeout(() => router.replace("/sign-in"), 1000);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  const PermissionItem = ({ icon, title, description, isGranted }: any) => (
    <View className="flex-row items-center py-5 border-b border-gray-100">
      <View className={`w-12 h-12 rounded-2xl items-center justify-center ${isGranted ? "bg-green-50" : "bg-blue-50"}`}>
        <MaterialCommunityIcons 
          name={icon} 
          size={24} 
          color={isGranted ? "#34c759" : "#0066cc"} 
        />
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-black font-semibold text-lg">{title}</Text>
        <Text className="text-gray-400 text-sm mt-0.5">{description}</Text>
      </View>
      {isGranted && (
        <MaterialCommunityIcons name="check-circle" size={24} color="#34c759" />
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 px-8 pt-12 pb-8">
        <Text className="text-black text-4xl font-bold tracking-tight">
          Permissions
        </Text>
        <Text className="text-gray-500 text-lg mt-4 leading-7">
          NovaTag requires the following to provide a premium tracking experience.
        </Text>

        <View className="mt-10">
          <PermissionItem 
            icon="bluetooth" 
            title="Bluetooth" 
            description="Used to detect and connect to your tags nearby."
            isGranted={status.bluetooth}
          />
          <PermissionItem 
            icon="map-marker" 
            title="Location" 
            description="Essential for precise finding and geofencing."
            isGranted={status.location}
          />
          <PermissionItem 
            icon="bell" 
            title="Notifications" 
            description="Stay updated with anti-loss and battery alerts."
            isGranted={status.notifications}
          />
        </View>

        <View className="flex-1" />

        <Pressable 
          onPress={() => router.replace("/sign-in")}
          className="bg-primary py-5 rounded-2xl items-center active:bg-primary/90"
        >
          <Text className="text-white font-semibold text-lg">
            {status.location && status.notifications && status.bluetooth ? "Success" : "Continue"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
