import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, Pressable, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardPanel } from "@components/CardPanel";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function SettingsScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [preciseLocation, setPreciseLocation] = useState(true);

  const SettingItem = ({ icon, label, value, type = "arrow", onToggle, onPress, color }: any) => (
    <Pressable 
      onPress={onPress}
      className="flex-row items-center py-4 border-b border-gray-50 active:bg-gray-50 rounded-xl"
    >
      <View className={`w-8 h-8 rounded-lg ${color || "bg-gray-100"} items-center justify-center`}>
        <MaterialCommunityIcons name={icon} size={18} color={color ? "white" : "#7a7a7a"} />
      </View>
      <Text className="flex-1 ml-4 text-black font-medium text-lg">{label}</Text>
      {type === "arrow" && (
        <View className="flex-row items-center">
          {value && <Text className="text-gray-400 mr-2">{value}</Text>}
          <MaterialCommunityIcons name="chevron-right" size={20} color="#d1d1d6" />
        </View>
      )}
      {type === "switch" && (
        <Switch 
          value={value} 
          onValueChange={onToggle}
          trackColor={{ false: "#e9e9eb", true: "#34c759" }}
          thumbColor="#ffffff"
        />
      )}
    </Pressable>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        <View className="px-8 pt-4 flex-row justify-between items-center">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
            <MaterialCommunityIcons name="chevron-left" size={28} color="black" />
          </Pressable>
          <Text className="text-black font-bold text-lg">Settings</Text>
          <View className="w-10" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="px-6 mt-6">
          <Text className="text-black text-3xl font-bold mb-8 ml-2">App Preferences</Text>

          <View className="space-y-8">
            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-2 mb-4">Experience</Text>
              <CardPanel intensity={10}>
                <SettingItem 
                  icon="weather-night" 
                  label="Dark Mode" 
                  type="switch" 
                  value={darkMode} 
                  onToggle={setDarkMode}
                  color="bg-indigo-500"
                />
                <SettingItem 
                  icon="bell-outline" 
                  label="Notifications" 
                  type="switch" 
                  value={notifications} 
                  onToggle={setNotifications}
                  color="bg-red-500"
                />
                <SettingItem 
                  icon="map-marker-outline" 
                  label="Precise Location" 
                  type="switch" 
                  value={preciseLocation} 
                  onToggle={setPreciseLocation}
                  color="bg-blue-500"
                />
              </CardPanel>
            </View>

            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-2 mb-4">Account</Text>
              <CardPanel intensity={10}>
                <SettingItem 
                  icon="account-outline" 
                  label="Personal Info" 
                  onPress={() => router.push("/account-setup")}
                />
                <SettingItem 
                  icon="shield-lock-outline" 
                  label="Security" 
                  onPress={() => {}}
                />
                <SettingItem 
                  icon="translate" 
                  label="Language" 
                  value="English"
                  onPress={() => {}}
                />
              </CardPanel>
            </View>

            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-2 mb-4">About</Text>
              <CardPanel intensity={10}>
                <SettingItem 
                  icon="information-outline" 
                  label="Version" 
                  value="1.0.42"
                  type="none"
                />
                <SettingItem 
                  icon="file-document-outline" 
                  label="Terms of Service" 
                  onPress={() => {}}
                />
                <SettingItem 
                  icon="shield-outline" 
                  label="Privacy Policy" 
                  onPress={() => {}}
                />
              </CardPanel>
            </View>

            <View className="h-20" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
